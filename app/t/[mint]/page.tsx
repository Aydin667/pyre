import type { Metadata } from "next";
import { VerifyPanel } from "@/components/verify-panel";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ mint: string }>;
}): Promise<Metadata> {
  const { mint } = await params;
  const short = `${mint.slice(0, 4)}…${mint.slice(-4)}`;
  return {
    title: `Seal ${short}`,
    description: `Live on-chain verification of the Pyre seal for ${mint}: locked dev allocation, vesting schedule, and launch certificate.`,
  };
}

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ mint: string }>;
}) {
  const { mint } = await params;
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="font-pixel text-2xl mb-2">
          <span className="text-green">&gt;</span> LAUNCH CERTIFICATE
        </h1>
        <p className="text-muted text-sm max-w-xl leading-relaxed">
          Every claim below is re-checked against the chain when you load this
          page. You don&apos;t have to trust Pyre — the escrow and
          certificate are public accounts.
        </p>
      </div>
      <VerifyPanel mint={mint} />
    </div>
  );
}
