# Pyre — X Brand Package

## Display name
**Pyre**

## Suggested @username options
1. `@pyredotlol`
2. `@pyrelaunch`
3. `@pyre_fun`
4. `@launchpyre`
5. `@zerodevbag`

## Bio (≤160 chars)
> Pump.fun launches where the dev buys first — so no sniper beats them — then burns 100% of it in the same block. Provably zero dev bag. Verify on-chain. pyrelaunch.lol

## Profile
- PFP: `/public/branding/pfp.png` (ember flame mark)
- Banner: `/public/branding/banner.png`
- Pinned: launch tweet below.

---

## Launch tweet (main)

> the dev bag is the whole problem. lock it, vest it, cliff it — buyers still know it's coming for them eventually.
>
> Pyre deletes it. on a Pyre launch the dev makes the token's first buy (so no sniper front-runs the launch) and then burns 100% of that buy in the same atomic block. the supply is permanently reduced and the dev walks away holding nothing.
>
> it's a real pump.fun token — same curve, same graduation. the only difference is there is no dev bag to dump, and you can prove it on-chain from the launch signature.
>
> first in. nothing kept.
>
> pyrelaunch.lol

## Short launch tweet

> pump.fun launches where the dev buys first, then burns 100% of it in the same block.
>
> zero dev bag, permanently — verify the burn on-chain.
>
> pyrelaunch.lol

## Technical launch tweet

> how Pyre works, in one Jito bundle (≤5 txs, one slot, atomic):
>
> tx1: pump.fun create_v2 + dev buy — the dev is first, no sniper beats them
> tx2: SPL Token-2022 Burn of 100% of that buy (total supply drops permanently) + a Lighthouse assert that the dev wallet holds 0, else the bundle reverts
> tx3: an on-chain certificate (SAS) recording the dev buy + burned amount + bundle sig
>
> the dev cannot keep the bag — it's destroyed in the same block it was bought. verify any mint: pyrelaunch.lol/api/verify/<mint>

## Follow-up tweets (5)

1. > locked ≠ safe. vested ≠ safe. those just put a timer on the dump.
   > burned = there is nothing left to dump. Pyre only does the last one.

2. > why does the dev buy at all if it's burned? because the first buy is the only way to beat snipers to your own launch. Pyre keeps the anti-snipe, throws away the bag.

3. > every Pyre launch permanently reduces supply by the dev buy. the bigger the dev commits, the more supply is destroyed at birth. skin in the game, then no game.

4. > every burn is public JSON: GET pyrelaunch.lol/api/verify/<mint>
   > returns the dev buy, the burned amount, and confirms the dev wallet is empty. terminals + TG bots: plug it in.

5. > three ways to handle a dev bag: SlotZero locks it, Thaw melts it, Pyre burns it. pick your risk tolerance. this one is for the people who want zero.

## Thread — how the technology works

> 1/ Pyre in one sentence: pump.fun launches where the dev buys first to block snipers, then burns 100% of that buy in the same block. no dev bag, provably. here's the machine 🧵

> 2/ the dev bag is the #1 rug vector. but a creator almost has to make the first buy — otherwise snipers front-run the launch and dump on the community. so you're stuck: buy and be feared, or don't and get sniped.

> 3/ locking or vesting the bag doesn't resolve it. a 30-day lock is just a 30-day countdown to the same dump. Pyre takes the only option that actually removes the threat: destroy the bag.

> 4/ a Pyre launch is one Jito bundle — up to 5 txs that land in the same slot or not at all. tx1: pump.fun create_v2 + the dev buy, same transaction, so nobody trades before it.

> 5/ tx2: an SPL Token-2022 Burn destroys 100% of the tokens from that buy. this isn't a transfer to a dead wallet — it's a real burn, so the mint's total supply drops by exactly that amount, forever.

> 6/ same tx2: a Lighthouse assertion requires the dev wallet to end the bundle holding zero tokens. off by one and the whole bundle — token creation included — reverts.

> 7/ tx3: an on-chain certificate via Solana Attestation Service records the dev buy, the burned amount, and the launch signature. any bot can read it from the mint address alone.

> 8/ so "the dev has no bag" isn't a claim — it's the state the token was born in. verify it yourself from the launch signature, no trust required.

> 9/ what Pyre doesn't do: stop third-party snipers (no venue can without owning the curve), or stop the creator from buying later on the open market like anyone else. it removes the launch bag, not the whole market.

> 10/ normal pump.fun token, normal curve, normal graduation. one difference: the dev bought first and burned it, so there's nothing to dump on you. launch: pyrelaunch.lol

## Content rules
- No rocket/fire-emoji spam (the mark is already a flame), no "revolutionary".
- Every claim must be verifiable from the certificate; if it isn't, don't post it.
- Always link certificates, not screenshots alone.

## Relationship to SlotZero / Thaw (internal note)
Pyre is the third sibling launchpad on the same infrastructure. SlotZero *locks* the dev bag behind a cliff; Thaw *melts* it with no cliff; Pyre *burns* it entirely. Same atomic-bundle + Lighthouse + SAS stack, three different answers to "what happens to the dev bag." Follow-up tweet #5 is the only place they should be named together.
