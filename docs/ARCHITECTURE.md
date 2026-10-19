# Architecture

**Snapshot:** October 2026.

## Stack

Plain static site: **HTML + CSS + a small JS** file. No framework, no build step required to serve locally.

| Piece | Role |
|-------|------|
| `index.html` | Markup, inline SVG logo sprite, age-gate dialog |
| `styles.css` | Layout, theme, responsive nav |
| `main.js` | Age gate + mobile menu |
| `assets/` | Packet / box images (WebP + JPG), optional SVG copies under `assets/logo/` |

## Working copies (build box)

| Path | Role |
|------|------|
| `/workspace/iceluck-v3` | Working copy for edits |
| `/workspace/iceluck-v3-live` | Frozen snapshot of what is currently live (read-only after deploy) |
| `/workspace/iceluck-deploy/public` | Staging folder uploaded by Wrangler |

Older read-only snapshots may exist beside these (e.g. pre-logo freezes); they are archives, not the deploy source.

## Hosting

- **Cloudflare Pages** project name: `iceluck`.
- Custom domains: **ice-luck.com** and **www.ice-luck.com** (DNS on Cloudflare).
- Default Pages hostname: `*.iceluck.pages.dev` (each deploy also gets a unique preview URL).
- The Cloudflare MCP / connector available to agents is treated as **read-oriented**; **publishes go through Wrangler** with credentials already on the box (see [DEPLOY.md](DEPLOY.md)). Never commit or print API tokens.

## Age gate

- Dialog blocks the page until the visitor confirms they are 18+.
- Preference key: **`iceluck_age_ok_18`** in `localStorage` (value `yes` when accepted).
- Implemented in `main.js`.

## Brand presentation (site)

- **Logo:** designer official mark as SVG (full framed logo, wordmark, wordmark + tagline). Fills use `currentColor`. No snowflake on site logos.
- **Nav / primary CTA:** Colombian flag yellow **`#FCD116`**, dark text/logo on yellow.
- **Hero and footer backgrounds:** black **`#0D0D0D`**.
- **Packet cards:** per-flavor accent gradients in CSS; photography in `assets/`.

## Intentionally out of scope

- E-commerce and payments.
- Contact, newsletter, or CRM.
- Social embeds or profile links on-page.
- Video (not on the live site yet).
- Separate app or CMS.

## Local preview

From the working tree, a simple static server is enough, e.g. `python3 -m http.server` pointed at `/workspace/iceluck-v3`.
