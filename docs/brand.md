# Pyre — Brand Identity

## Name

**Pyre** — a pyre is where an offering is burned. On a Pyre launch the dev's buy goes straight onto the fire: bought first to block snipers, then burned to nothing in the same block. The name is the mechanic.

Ticker: `$PYRE`.

## Coin

- **Coin name:** Pyre
- **Ticker:** `$PYRE`

Launched through Pyre itself — the dev buy burned like any other. Dogfooding the burn is the launch story.

## Tagline

**"The dev buys first, then burns it."**

Secondary: "Zero dev bag, forever." / "First in, nothing kept."

## Voice
Same family as the sibling products: technical, dry, exact. State the guarantee and the non-guarantee plainly.

## Visual identity

**Aesthetic:** the shared phosphor/terminal system, but the signal color is **ember orange** — fire, burning, ash. Near-black base, hot-orange accent, a bright core highlight for sparks.

### Color system
| Token | Hex | Use |
|---|---|---|
| `bg` | `#0A0A0C` | page background |
| `surface` | `#111114` | cards, panels |
| `surface-2` | `#1A1A1F` | inputs, raised |
| `line` | `#26262C` | borders |
| `text` | `#E8E6E1` | primary text |
| `muted` | `#8B8B93` | secondary text |
| `ember` (accent) | `#FF6A2B` | primary accent — "burned", CTAs, success |
| `ember-dim` | `#5C2410` | charred borders/fills |
| `ember-hi` | `#FFC878` | spark highlight |
| `amber` | `#FFCE4A` | warnings |
| `red` | `#FF4D4D` | errors |

(In code the CSS token is still `--color-green` for component-class reuse; its value is the ember above.)

### Typography
- **Display / logo:** Silkscreen (pixel).
- **UI / body:** Space Grotesk.
- **Data / code:** JetBrains Mono.

### Logo
Wordmark `PYRE` in Silkscreen, split two-tone: `PY` in text-white, `RE` in ember. Mark: a **pixel flame** — teardrop body pointing up, hot yellow-white inner core, a spark flicking off the tip, dark charred base. Reads at avatar size.

### Mascot
None — the flame mark carries the identity.

### UI language
Identical system to the siblings (1px borders, 2px radius, terminal prompts, `[ OK ]`/`[FAIL]` cells, blinking cursor). The success animation is a "▲ BURNED" stamp.

## Asset specs
- PFP `/public/branding/pfp.png`: 1024×1024, flame mark, ≤8 colors.
- Banner `/public/branding/banner.png`: 1500×500, wordmark + tagline + `CREATE + BUY + BURN = ZERO DEV BAG.` pipeline.
- OG `/public/branding/og.png`: 1200×630.
- Favicon: 32×32 flame derivative.

## Product one-liner
"This is Pump.fun, except the dev buys first and burns it — provably zero dev bag, forever."
