import "server-only";
/**
 * Pyre's core leg: burn 100% of the dev's bought tokens in the same atomic
 * bundle that created the token. A real SPL burn (Token-2022) — supply is
 * permanently reduced, the dev keeps nothing. No escrow, no vesting.
 */
import { PublicKey, type TransactionInstruction } from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  createBurnInstruction,
} from "@solana/spl-token";
import BN from "bn.js";

// Solana's canonical incinerator (used only for reference/links; the burn
// itself is an SPL Burn instruction, not a transfer here).
export const INCINERATOR = "1nc1nerator11111111111111111111111111111111";

export function creatorAta(mint: PublicKey, creator: PublicKey): PublicKey {
  return getAssociatedTokenAddressSync(mint, creator, false, TOKEN_2022_PROGRAM_ID);
}

/**
 * Burn `amountRaw` of `mint` from the creator's ATA. The creator (owner)
 * must sign — which they do, since they sign the launch transactions.
 */
export function buildBurnInstruction(args: {
  mint: PublicKey;
  creator: PublicKey;
  amountRaw: BN;
}): TransactionInstruction {
  return createBurnInstruction(
    creatorAta(args.mint, args.creator),
    args.mint,
    args.creator,
    BigInt(args.amountRaw.toString()),
    [],
    TOKEN_2022_PROGRAM_ID,
  );
}
