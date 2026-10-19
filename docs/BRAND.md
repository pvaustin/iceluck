# Brand

**Snapshot:** October 2026.

## Product identity

IceLuck — frozen cocktails in packet form, light ABV, Medellín. Awareness site only; ownership of the brand is IceLuck’s. TuskerMind develops the website and is credited as such, not as brand owner.

## Official logo (designer file)

Source artwork is a square mark (~1254×1254). Site implementation is vector SVG with `currentColor` fills.

| Variant | Use on site |
|---------|-------------|
| Full logo (square frame + ICE / LUCK + rule + tagline) | Hero |
| Wordmark (ICE / LUCK only) | Header / mobile menu |
| Wordmark + tagline | Age gate, footer |

Rules:

- **ICE** and **LUCK** stacked, visually equal width in the official mark.
- Tagline under a horizontal rule: **FROZEN COCKTAILS** (English, part of the logo).
- **No snowflake** on website logos (packaging photography may still show a snowflake on physical packs; that is product art, not the site mark).
- Prefer accessible naming (`aria-label` / `role="img"` + `<title>`), e.g. “ICE LUCK” / “ICE LUCK Frozen Cocktails”.

Standalone SVG files may also live under `assets/logo/` (`logo-full.svg`, `wordmark.svg`, `wordmark-tagline.svg`); the live page inlines a sprite for the placements above.

## Colors (site)

| Token | Hex | Typical use |
|-------|-----|-------------|
| Black | `#0D0D0D` | Hero / footer backgrounds; text and icons on yellow |
| Colombian yellow (flag) | `#FCD116` | Nav bar, primary CTA pill (“Conoce los sabores”), mobile menu panel |
| Ink | `#141414` | Dark text on light / yellow surfaces where used |
| Older sun yellow | `#F6C833` | Still present in CSS for some non-CTA surfaces (e.g. age-gate box, flavor card accents); primary nav/CTA use `#FCD116` |

Packet cards use additional accent colors in CSS (cream, aqua, lime, mint, etc.) to echo each flavor’s packaging.

Contrast for black text on `#FCD116` meets WCAG AA by a wide margin for normal UI text.

## Social

Instagram **@iceluck.co** exists for the brand but **must not appear on the website** for now (no handle, link, embed, or QR). Same rule for WhatsApp and other contact channels until approved.

## Copy constraints

- Spanish body copy; do not invent English marketing pages.
- Keep the two Colombian legal warnings verbatim (see [PROJECT.md](PROJECT.md)).
- Do not imply IceLuck is a TuskerMind brand.
