/** Shared types between client and server. Amounts cross the wire as strings. */

export interface LaunchFormData {
  name: string;
  symbol: string;
  description: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  devBuySol: number;
}

/** Human-readable description of one transaction the user will sign. */
export interface TxManifestEntry {
  index: number;
  label: string;
  signer: "you" | "platform";
  actions: string[];
}

export interface CostBreakdown {
  devBuyLamports: string;
  platformFeeLamports: string;
  jitoTipLamports: string;
  estNetworkLamports: string;
  totalLamports: string;
}

export interface PrepareResponse {
  sessionId: string;
  mint: string;
  /** raw (6-decimal) amount the dev buy yields — all of it is burned */
  burnedTokensRaw: string;
  burnedPctOfSupply: number;
  metadataUri: string;
  cost: CostBreakdown;
  manifest: TxManifestEntry[];
  /** base64 unsigned transactions the wallet must sign, in order */
  transactionsToSign: string[];
  dryRun: boolean;
}

export type BundleState =
  | "pending"
  | "landed"
  | "failed"
  | "expired"
  | "simulated";

export interface ExecuteResponse {
  bundleId: string;
  state: BundleState;
}

export interface StatusResponse {
  state: BundleState;
  slot?: number;
  signatures?: string[];
  error?: string;
  mint?: string;
}

export interface CheckResult {
  id: string;
  label: string;
  status: "ok" | "fail" | "warn" | "pending";
  detail: string;
  link?: string;
}

export interface VerificationReport {
  mint: string;
  /** true = a valid Pyre burn certificate exists and checks pass */
  sealed: boolean;
  checkedAt: number;
  name?: string;
  symbol?: string;
  imageUri?: string;
  creator?: string;
  launchSlot?: number;
  bundleSignature?: string;
  devBuySol?: number;
  burnedTokensRaw?: string;
  burnedPctOfSupply?: number;
  devHoldsNowRaw?: string;
  attestation?: string;
  checks: CheckResult[];
  links: {
    pumpFun: string;
    solscan: string;
    attestation?: string;
  };
}

export interface LaunchListEntry {
  mint: string;
  name: string;
  symbol: string;
  imageUri?: string;
  creator: string;
  launchedAt: number;
  devBuySol: number;
  burnedPctOfSupply: number;
}

export interface ApiError {
  error: { code: string; message: string };
}
