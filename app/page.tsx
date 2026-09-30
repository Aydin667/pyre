import Link from "next/link";
import Image from "next/image";
import { SealDemo } from "@/components/seal-demo";
import { RecentLaunches } from "@/components/recent-launches";

export default function Home() {
  return (
    <div>
      {/* hero */}
      <section className="scanlines border-b border-line">
        <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="flex flex-col items-start gap-6 max-w-3xl">
            <div className="flex items-center gap-2 font-mono text-xs text-muted border border-line rounded-sm px-3 py-1.5">
              <span className="text-green pulse-dot">●</span>
              real pump.fun tokens · real curve · real graduation
            </div>
            <h1 className="font-pixel text-3xl sm:text-5xl leading-tight">
              THE DEV BUYS
              <br />
              FIRST, THEN <span className="text-green">BURNS IT</span>
              <span className="text-green cursor-blink">▌</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted leading-relaxed max-w-2xl">
              Launch Pump.fun tokens where the dev makes the first buy — so no
              sniper beats them — and then{" "}
              <span className="text-text">burns 100% of it in the same atomic bundle</span>.
              Provably zero dev bag, forever.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/launch"
                className="font-mono text-base bg-green text-bg font-medium px-6 py-2.5 rounded-sm hover:bg-green-hi active:translate-y-px transition-all"
              >
                Launch →
              </Link>
              <Link
                href="/how"
                className="font-mono text-base border border-line text-text px-6 py-2.5 rounded-sm hover:border-green-dim hover:bg-surface transition-all"
              >
                How it works
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* demo */}
      <section className="mx-auto max-w-6xl px-4 -mt-8 relative z-10">
        <SealDemo />
      </section>

      {/* the problem, in numbers */}
      <section className="mx-auto max-w-6xl px-4 mt-20">
        <div className="grid gap-px sm:grid-cols-3 bg-line border border-line rounded-sm overflow-hidden">
          {[
            {
              n: ">50%",
              t: "of pump.fun launches are sniped in their first block — the dev buy is the only way to be first",
              s: "Pine Analytics, “Exit Liquidity Machines”",
            },
            {
              n: "0",
              t: "tokens the dev keeps: the entire buy is burned in the same bundle it was bought",
              s: "not locked, not vested — gone",
            },
            {
              n: "1 slot",
              t: "is all Pyre needs: the buy and the burn land together, before anyone else can trade",
              s: "atomic by construction, not by promise",
            },
          ].map((c) => (
            <div key={c.n} className="bg-surface p-6">
              <div className="font-pixel text-2xl text-green mb-2">{c.n}</div>
              <div className="text-sm text-text leading-relaxed">{c.t}</div>
              <div className="font-mono text-[11px] text-muted mt-3">{c.s}</div>
            </div>
          ))}
        </div>
      </section>

      {/* how it works, 3 steps */}
      <section className="mx-auto max-w-6xl px-4 mt-20">
        <h2 className="font-mono text-sm text-muted mb-6">
          <span className="text-green">&gt;</span> HOW IT WORKS
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              k: "01",
              t: "Set the dev buy",
              d: "Fill the normal Pump.fun launch form, plus one number: how much SOL to spend on the first buy. That buy makes you first in line, ahead of any sniper.",
            },
            {
              k: "02",
              t: "Sign one bundle",
              d: "Token creation, your dev buy, and a 100% burn of that buy land in a single atomic Jito bundle. A Lighthouse assertion reverts everything if your wallet keeps a single token.",
            },
            {
              k: "03",
              t: "Trade with proof",
              d: "The launch gets an on-chain certificate anyone can verify — buyers see a live-checked burn instead of trusting a screenshot.",
            },
          ].map((s) => (
            <div key={s.k} className="border border-line bg-surface rounded-sm p-6">
              <div className="font-pixel text-xs text-green mb-4">{s.k}</div>
              <div className="font-medium text-lg mb-2">{s.t}</div>
              <p className="text-sm text-muted leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* recent launches */}
      <section className="mx-auto max-w-6xl px-4 mt-20">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="font-mono text-sm text-muted">
            <span className="text-green">&gt;</span> RECENT PYRE LAUNCHES
          </h2>
          <Link
            href="/launches"
            className="font-mono text-xs text-muted hover:text-green transition-colors"
          >
            view all →
          </Link>
        </div>
        <RecentLaunches limit={6} />
      </section>

      {/* under the hood */}
      <section className="mx-auto max-w-6xl px-4 mt-20">
        <div className="border border-line rounded-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-line bg-surface">
            <h2 className="font-mono text-sm text-muted">
              <span className="text-green">&gt;</span> UNDER THE HOOD
            </h2>
          </div>
          <div className="grid gap-px sm:grid-cols-2 bg-line">
            {[
              {
                t: "Real Pump.fun tokens",
                d: "Tokens are created by Pump.fun's own on-chain program (create_v2). Same bonding curve, same graduation to PumpSwap, tradeable everywhere.",
              },
              {
                t: "A real burn, not a lock",
                d: "The dev buy is destroyed with an SPL burn instruction — total supply is permanently reduced. No escrow, no vesting, nothing to unlock later. Pyre never holds your tokens.",
              },
              {
                t: "Assertions, not promises",
                d: "A Lighthouse instruction asserts your wallet ends the bundle with zero tokens. If not, the whole bundle — token included — reverts.",
              },
              {
                t: "Certificates for bots",
                d: "Every burn is a Solana Attestation Service record keyed by mint. GET /api/verify/<mint> returns the burned amount and live proof for terminals and TG bots.",
              },
            ].map((c) => (
              <div key={c.t} className="bg-bg p-6">
                <div className="font-mono text-sm text-green mb-2">{c.t}</div>
                <p className="text-sm text-muted leading-relaxed">{c.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 border border-amber/30 bg-amber/5 rounded-sm px-5 py-4">
          <p className="font-mono text-xs text-amber leading-relaxed">
            WHAT PYRE DOES NOT DO: it cannot stop third-party snipers (no venue
            can, without owning the curve), and it cannot stop the creator from
            buying more later on the open market — that stays visible to anyone.
            Pyre makes one thing structurally true: the dev&apos;s launch buy was
            burned and can never be dumped on you.
          </p>
        </div>
      </section>

      {/* bottom CTA */}
      <section className="mx-auto max-w-6xl px-4 mt-20">
        <div className="dotgrid border border-line rounded-sm px-6 py-14 text-center">
          <Image
            src="/favicon-32.png"
            alt=""
            width={40}
            height={40}
            className="pixelated mx-auto mb-5"
          />
          <h2 className="font-pixel text-xl sm:text-2xl mb-3">
            LAUNCH WITH NO BAG
          </h2>
          <p className="text-muted mb-6 max-w-md mx-auto">
            No dev bag is the strongest fair-launch signal there is. Prove it in
            the first slot.
          </p>
          <Link
            href="/launch"
            className="inline-block font-mono bg-green text-bg font-medium px-8 py-3 rounded-sm hover:bg-green-hi active:translate-y-px transition-all"
          >
            Launch →
          </Link>
        </div>
      </section>
    </div>
  );
}
