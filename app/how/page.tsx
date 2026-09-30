import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
  description:
    "The full mechanics of a Pyre launch: capped dev buy, 100% burn at slot zero, Lighthouse assertions, atomic Jito bundle, and on-chain certificates.",
};

const PROGRAMS = [
  {
    name: "Pump.fun",
    id: "6EF8rrecthR5Dkzon8Nwu78hRvfCKubJ14M5uBEwF6P",
    role: "Token creation (create_v2) and the bonding curve. Your token is a normal Pump.fun token.",
  },
  {
    name: "SPL Token-2022",
    id: "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb",
    role: "The burn instruction. 100% of the dev buy is burned from the creator's own account — supply is permanently reduced. No escrow, nothing to unlock.",
  },
  {
    name: "Lighthouse",
    id: "L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95",
    role: "Assertion program. Reverts the whole bundle unless the creator's wallet ends with exactly zero tokens.",
  },
  {
    name: "Solana Attestation Service",
    id: "22zoJMtdu4tQc2PzL74ZUT7FrwgB1Udec8DdW4yw4BdG",
    role: "The burn certificate registry (Solana Foundation program). One attestation per launch, keyed by mint.",
  },
];

export default function HowPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-12">
      <div>
        <h1 className="font-pixel text-2xl mb-3">
          <span className="text-green">&gt;</span> HOW IT WORKS
        </h1>
        <p className="text-muted leading-relaxed">
          Pyre makes one claim and makes it structural:{" "}
          <span className="text-text">
            the dev buys first, then burns 100% of it in the same block — so
            there is no dev bag to dump, ever.
          </span>{" "}
          Here is the entire machine — no hand-waving.
        </p>
      </div>

      <section>
        <h2 className="font-mono text-sm text-green mb-4">THE PROBLEM</h2>
        <div className="space-y-3 text-sm text-muted leading-relaxed">
          <p>
            The dev bag is the single biggest source of rugs. To avoid getting
            sniped, a creator has to make the first buy — but the moment they
            hold that bag, buyers rightly assume it will be dumped on them. The
            most profitable snipers are funded by the token&apos;s own deployer
            (Pine Analytics,{" "}
            <a
              className="text-green hover:underline"
              href="https://pineanalytics.substack.com/p/exit-liquidity-machines"
              target="_blank"
              rel="noopener noreferrer"
            >
              &ldquo;Exit Liquidity Machines&rdquo;
            </a>
            ).
          </p>
          <p>
            Locking or vesting the bag only delays the question. Pyre answers it
            outright: the dev makes the first buy to block snipers, then destroys
            every token of it in the same atomic bundle. First in, nothing kept.
          </p>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm text-green mb-4">THE BUNDLE</h2>
        <div className="border border-line rounded-sm overflow-hidden font-mono text-sm">
          {[
            {
              t: "tx 1 — create + buy",
              d: "Pump.fun's create_v2 instruction and the dev buy share one transaction. It is physically impossible for anyone to trade before the dev buy — they are the same transaction.",
            },
            {
              t: "tx 2 — burn + assert",
              d: "Every token from the dev buy is destroyed with an SPL Token-2022 Burn instruction — the mint's total supply drops by exactly that amount, permanently. A Lighthouse assertion then requires the creator's wallet to hold exactly zero tokens, or the whole bundle reverts.",
            },
            {
              t: "tx 3 — certificate",
              d: "Pyre writes a Solana Attestation Service record: mint, dev buy size, burned amount, and the launch signature. Any bot can find it from the mint address alone.",
            },
          ].map((s) => (
            <div key={s.t} className="border-b border-line last:border-0 px-5 py-4">
              <div className="text-text mb-1">{s.t}</div>
              <p className="text-xs text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
          <div className="px-5 py-4 bg-green-dim/15">
            <p className="text-xs text-green leading-relaxed">
              The three transactions are submitted as one Jito bundle: they
              land in the same slot, in order, or none of them land at all.
              There is no state of the world where the dev keeps the bag.
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm text-green mb-4">
          WHAT IS AND ISN&apos;T GUARANTEED
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="border border-green-dim rounded-sm p-5">
            <div className="font-mono text-xs text-green mb-3">GUARANTEED</div>
            <ul className="space-y-2 text-sm text-muted">
              <li>· the dev buy executes before any other trade</li>
              <li>· 100% of that buy is burned in the same bundle</li>
              <li>· total supply is permanently reduced</li>
              <li>· the creator ends the launch holding zero</li>
              <li>· certificate machine-verifiable forever</li>
            </ul>
          </div>
          <div className="border border-amber/40 rounded-sm p-5">
            <div className="font-mono text-xs text-amber mb-3">
              NOT GUARANTEED
            </div>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                · third-party snipers can still buy early — no venue can stop
                this without owning the curve
              </li>
              <li>
                · the creator can buy more later on the open market, like anyone
                — visible to any scanner; the burned launch buy stays gone
              </li>
              <li>· price. this is a memecoin launchpad, not a promise</li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm text-green mb-4">
          PROGRAMS WE COMPOSE
        </h2>
        <p className="text-sm text-muted mb-4 leading-relaxed">
          Pyre deploys no smart contract of its own. A launch composes
          four battle-tested programs; our code only builds transactions you
          sign in your own wallet.
        </p>
        <div className="border border-line rounded-sm divide-y divide-line overflow-x-auto">
          {PROGRAMS.map((p) => (
            <div key={p.id} className="px-5 py-4">
              <div className="flex flex-wrap items-baseline gap-x-3 mb-1">
                <span className="font-mono text-sm text-text">{p.name}</span>
                <a
                  href={`https://solscan.io/account/${p.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-muted hover:text-green break-all transition-colors"
                >
                  {p.id}
                </a>
              </div>
              <p className="font-mono text-xs text-muted leading-relaxed">
                {p.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-mono text-sm text-green mb-4">FOR BOTS + TERMINALS</h2>
        <p className="text-sm text-muted leading-relaxed mb-3">
          The verifier is a public API. Filter for Pyre launches, show the burn
          state next to any mint:
        </p>
        <pre className="border border-line bg-surface rounded-sm px-4 py-3 font-mono text-xs text-text overflow-x-auto">
{`GET https://pyrelaunch.lol/api/verify/<mint>
GET https://pyrelaunch.lol/api/launches`}
        </pre>
      </section>

      <div className="border-t border-line pt-8">
        <Link
          href="/launch"
          className="inline-block font-mono bg-green text-bg font-medium px-6 py-2.5 rounded-sm hover:bg-green-hi transition-colors"
        >
          Launch on Pyre →
        </Link>
      </div>
    </div>
  );
}
