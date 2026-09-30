import "server-only";
/**
 * Launch orchestrator — builds and executes the Pyre burn bundle.
 *
 * Bundle layout (atomic, one slot, all-or-nothing):
 *   tx1 (signed: creator wallet + mint keypair)
 *     create_v2 + creator ATA + dev buy
 *   tx2 (signed: creator wallet)
 *     Burn 100% of the dev's bought tokens (SPL Token-2022 Burn)
 *     + Lighthouse assert(creator ATA == 0) + platform fee + Jito tip
 *   tx3 (signed: platform key; rebuilt at execute to embed tx1's signature)
 *     SAS launch-certificate attestation (records the burned amount)
 */
import {
  ComputeBudgetProgram,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  type TransactionInstruction,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
} from "@solana/spl-token";
import BN from "bn.js";
import bs58 from "bs58";
import type {
  CostBreakdown,
  PrepareResponse,
  TxManifestEntry,
} from "@/lib/types";
import { env, getPlatformKeypair } from "./env";
import { getConnection } from "./rpc";
import {
  buildCreateAndBuyInstructions,
  computeNewCurveBuyAmount,
} from "./pump";
import { buildBurnInstruction } from "./burn";
import { buildAssertTokenAmountInstruction } from "./lighthouse";
import { buildCreateAttestationInstruction } from "./attest";
import { buildTipInstruction, sendBundle } from "./jito";
import {
  createSession,
  getSession,
  rememberBundle,
  type LaunchSession,
} from "./session";

const EST_NETWORK_LAMPORTS = 4_000_000n; // rent (mint/curve/ATA) + fees, conservative

export interface PrepareArgs {
  creator: PublicKey;
  name: string;
  symbol: string;
  metadataUri: string;
  devBuyLamports: bigint;
}

function toV0Tx(
  payer: PublicKey,
  blockhash: string,
  instructions: TransactionInstruction[],
): VersionedTransaction {
  const msg = new TransactionMessage({
    payerKey: payer,
    recentBlockhash: blockhash,
    instructions,
  }).compileToV0Message();
  return new VersionedTransaction(msg);
}

function b64(tx: VersionedTransaction): string {
  return Buffer.from(tx.serialize()).toString("base64");
}

export async function prepareLaunch(args: PrepareArgs): Promise<PrepareResponse> {
  const connection = getConnection();
  const platform = getPlatformKeypair();
  const mint = Keypair.generate();
  const nowTs = Math.floor(Date.now() / 1000);

  const { tokensRaw, totalSupply } = await computeNewCurveBuyAmount(
    args.devBuyLamports,
  );
  if (tokensRaw.lten(0)) {
    throw new Error("Dev buy too small to yield tokens");
  }

  // tx1 — create + dev buy
  const createBuyIxs = await buildCreateAndBuyInstructions({
    mint: mint.publicKey,
    name: args.name,
    symbol: args.symbol,
    uri: args.metadataUri,
    creator: args.creator,
    user: args.creator,
    tokensRaw,
    solLamports: args.devBuyLamports,
  });
  const tx1Ixs = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 400_000 }),
    ...createBuyIxs,
  ];

  // tx2 — burn 100% of the dev buy + assert zero + fees
  const burnIx = buildBurnInstruction({
    mint: mint.publicKey,
    creator: args.creator,
    amountRaw: tokensRaw,
  });
  const creatorAta = getAssociatedTokenAddressSync(
    mint.publicKey,
    args.creator,
    false,
    TOKEN_2022_PROGRAM_ID,
  );
  const assertZero = await buildAssertTokenAmountInstruction(creatorAta, 0n);
  const platformFeeIx = SystemProgram.transfer({
    fromPubkey: args.creator,
    toPubkey: platform.publicKey,
    lamports: env.platformFeeLamports,
  });
  const tipIx = buildTipInstruction(args.creator, env.jitoTipLamports);

  const tx2Ixs = [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 120_000 }),
    burnIx,
    assertZero,
    platformFeeIx,
    tipIx,
  ];

  const { blockhash } = await connection.getLatestBlockhash("confirmed");
  const tx1 = toV0Tx(args.creator, blockhash, tx1Ixs);
  const tx2 = toV0Tx(args.creator, blockhash, tx2Ixs);

  // tx3 — attestation (placeholder launch_sig at prepare; rebuilt at execute)
  const attestationTx = await buildAttestationTx({
    platform,
    mint: mint.publicKey,
    creator: args.creator,
    devBuyLamports: args.devBuyLamports,
    tokensRaw,
    launchSig: "",
    launchedAt: nowTs,
    blockhash,
  });

  const pctOfSupply = Number(
    (tokensRaw.muln(10_000).div(totalSupply).toNumber() / 100).toFixed(2),
  );

  const cost: CostBreakdown = {
    devBuyLamports: args.devBuyLamports.toString(),
    platformFeeLamports: env.platformFeeLamports.toString(),
    jitoTipLamports: env.jitoTipLamports.toString(),
    estNetworkLamports: EST_NETWORK_LAMPORTS.toString(),
    totalLamports: (
      args.devBuyLamports +
      env.platformFeeLamports +
      env.jitoTipLamports +
      EST_NETWORK_LAMPORTS
    ).toString(),
  };

  const manifest: TxManifestEntry[] = [
    {
      index: 1,
      label: "Create token + dev buy",
      signer: "you",
      actions: [
        `Create ${args.symbol} on Pump.fun (create_v2)`,
        `Buy ${formatTokens(tokensRaw)} ${args.symbol} for ${lamportsToSol(args.devBuyLamports)} SOL — guaranteed first trade, so no sniper beats you`,
      ],
    },
    {
      index: 2,
      label: "Burn the dev buy",
      signer: "you",
      actions: [
        `Burn 100% of the ${formatTokens(tokensRaw)} ${args.symbol} you just bought (SPL burn — supply permanently reduced)`,
        "Lighthouse assertion: your wallet must end this bundle holding exactly 0 tokens — otherwise everything reverts",
        `Platform fee ${lamportsToSol(env.platformFeeLamports)} SOL + Jito tip ${lamportsToSol(env.jitoTipLamports)} SOL`,
      ],
    },
    {
      index: 3,
      label: "On-chain certificate",
      signer: "platform",
      actions: [
        "Pyre writes the burn certificate (Solana Attestation Service) — paid by the platform",
      ],
    },
  ];

  const session = createSession({
    creator: args.creator.toBase58(),
    mint,
    unsignedTxs: [b64(tx1), b64(tx2)],
    attestationTx: b64(attestationTx),
    meta: {
      name: args.name,
      symbol: args.symbol,
      metadataUri: args.metadataUri,
      devBuyLamports: args.devBuyLamports.toString(),
      tokensRaw: tokensRaw.toString(),
    },
  });

  return {
    sessionId: session.id,
    mint: mint.publicKey.toBase58(),
    burnedTokensRaw: tokensRaw.toString(),
    burnedPctOfSupply: pctOfSupply,
    metadataUri: args.metadataUri,
    cost,
    manifest,
    transactionsToSign: session.unsignedTxs,
    dryRun: env.dryRun,
  };
}

async function buildAttestationTx(args: {
  platform: Keypair;
  mint: PublicKey;
  creator: PublicKey;
  devBuyLamports: bigint;
  tokensRaw: BN;
  launchSig: string;
  launchedAt: number;
  blockhash: string;
}): Promise<VersionedTransaction> {
  const { instruction } = await buildCreateAttestationInstruction({
    platformAuthority: args.platform.publicKey,
    mint: args.mint,
    data: {
      mint: args.mint.toBase58(),
      creator: args.creator.toBase58(),
      dev_buy_lamports: args.devBuyLamports,
      tokens_burned: BigInt(args.tokensRaw.toString()),
      launch_sig: args.launchSig,
      launched_at: BigInt(args.launchedAt),
    },
  });
  return toV0Tx(args.platform.publicKey, args.blockhash, [
    ComputeBudgetProgram.setComputeUnitLimit({ units: 80_000 }),
    instruction,
  ]);
}

export class LaunchError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

export interface ExecuteArgs {
  sessionId: string;
  signedTxs: string[]; // base64, same order as transactionsToSign
}

export async function executeLaunch(
  args: ExecuteArgs,
): Promise<{ bundleId: string; state: "pending" | "simulated" }> {
  const session = getSession(args.sessionId);
  if (!session) {
    throw new LaunchError(
      "SESSION_NOT_FOUND",
      "Launch session expired or unknown — rebuild the launch and try again.",
    );
  }
  if (session.consumed && session.bundleId) {
    return { bundleId: session.bundleId, state: "pending" };
  }
  if (args.signedTxs.length !== session.unsignedTxs.length) {
    throw new LaunchError("BAD_INPUT", "Wrong number of signed transactions.");
  }

  // Verify the wallet did not alter what we issued: the serialized MESSAGE
  // must be byte-identical; only signatures may differ.
  const signed = args.signedTxs.map((b) =>
    VersionedTransaction.deserialize(Buffer.from(b, "base64")),
  );
  for (let i = 0; i < signed.length; i++) {
    const issued = VersionedTransaction.deserialize(
      Buffer.from(session.unsignedTxs[i], "base64"),
    );
    const a = Buffer.from(signed[i].message.serialize());
    const b = Buffer.from(issued.message.serialize());
    if (!a.equals(b)) {
      throw new LaunchError(
        "TX_MISMATCH",
        `Transaction ${i + 1} does not match what was issued. Refusing to co-sign.`,
      );
    }
  }

  const [tx1, tx2] = signed;
  // Attach the mint keypair signature to tx1 (create_v2 requires it). tx2 has
  // no server-side signer (no escrow) — the creator is its only signer.
  tx1.sign([session.mint]);

  const platform = getPlatformKeypair();
  const launchSig = bs58.encode(tx1.signatures[0]);
  const issued3 = VersionedTransaction.deserialize(
    Buffer.from(session.attestationTx, "base64"),
  );
  const blockhash = issued3.message.recentBlockhash;
  const finalTx3 = await rebuildAttestation(session, platform, blockhash, launchSig);
  if (!finalTx3) {
    throw new LaunchError(
      "ATTESTATION_BUILD_FAILED",
      "Could not build the launch certificate transaction.",
    );
  }
  finalTx3.sign([platform]);

  session.consumed = true;

  if (env.dryRun) {
    await simulateDryRun([tx1, tx2, finalTx3]);
    const fakeBundleId = `dryrun-${session.id}`;
    session.bundleId = fakeBundleId;
    rememberBundle(fakeBundleId, session.mint.publicKey.toBase58());
    return { bundleId: fakeBundleId, state: "simulated" };
  }

  const bundleId = await sendBundle([tx1, tx2, finalTx3]);
  session.bundleId = bundleId;
  rememberBundle(bundleId, session.mint.publicKey.toBase58());
  return { bundleId, state: "pending" };
}

/**
 * Dry-run validation. Prefers the RPC's simulateBundle (Helius/Jito RPCs) so
 * the whole 3-tx chain is validated statefully; falls back to simulating tx1
 * alone (create+buy) on RPCs without bundle simulation.
 */
async function simulateDryRun(txs: VersionedTransaction[]): Promise<void> {
  const connection = getConnection();
  try {
    const res = await fetch(env.rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: 1,
        method: "simulateBundle",
        params: [
          {
            encodedTransactions: txs.map((t) =>
              Buffer.from(t.serialize()).toString("base64"),
            ),
          },
          { skipSigVerify: true, replaceRecentBlockhash: true, encoding: "base64" },
        ],
      }),
    });
    const json = (await res.json()) as {
      result?: {
        value?: {
          summary?: unknown;
          transactionResults?: Array<{ err: unknown; logs?: string[] }>;
        };
      };
      error?: { message?: string; code?: number };
    };
    if (!json.error && json.result?.value) {
      const summary = json.result.value.summary;
      const failed =
        summary && summary !== "succeeded" && typeof summary === "object";
      if (failed) {
        const results = json.result.value.transactionResults ?? [];
        const lastLogs = results
          .flatMap((r) => r.logs ?? [])
          .slice(-6)
          .join(" | ");
        throw new LaunchError(
          "SIMULATION_FAILED",
          `Bundle simulation failed: ${JSON.stringify(summary).slice(0, 300)} — logs: ${lastLogs}`,
        );
      }
      return;
    }
  } catch (e) {
    if (e instanceof LaunchError) throw e;
  }
  const sim = await connection.simulateTransaction(txs[0], {
    sigVerify: false,
    replaceRecentBlockhash: true,
  });
  if (sim.value.err) {
    throw new LaunchError(
      "SIMULATION_FAILED",
      `Dry-run simulation failed: ${JSON.stringify(sim.value.err)} — logs: ${(sim.value.logs ?? []).slice(-5).join(" | ")}`,
    );
  }
}

async function rebuildAttestation(
  session: LaunchSession,
  platform: Keypair,
  blockhash: string,
  launchSig: string,
): Promise<VersionedTransaction | null> {
  try {
    const { instruction } = await buildCreateAttestationInstruction({
      platformAuthority: platform.publicKey,
      mint: session.mint.publicKey,
      data: {
        mint: session.mint.publicKey.toBase58(),
        creator: session.creator,
        dev_buy_lamports: BigInt(session.meta.devBuyLamports),
        tokens_burned: BigInt(session.meta.tokensRaw),
        launch_sig: launchSig,
        launched_at: BigInt(Math.floor(Date.now() / 1000)),
      },
    });
    return toV0Tx(platform.publicKey, blockhash, [
      ComputeBudgetProgram.setComputeUnitLimit({ units: 80_000 }),
      instruction,
    ]);
  } catch {
    return null;
  }
}

function lamportsToSol(l: bigint): string {
  return (Number(l) / 1e9).toLocaleString("en-US", { maximumFractionDigits: 4 });
}

function formatTokens(raw: BN): string {
  const whole = raw.div(new BN(1_000_000));
  return Number(whole.toString()).toLocaleString("en-US");
}
