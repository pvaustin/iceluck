# Site (live hosting summary)

**Snapshot:** October 2026.

## Hosting

| Item | Value |
|------|--------|
| Platform | Cloudflare Pages |
| Project name | `iceluck` |
| Custom domains | `ice-luck.com`, `www.ice-luck.com` |
| Preview host | `*.iceluck.pages.dev` |

DNS for the custom domains is on Cloudflare for this project. Deploys use Wrangler against the Pages project; do not commit API tokens or account credentials (see [DEPLOY.md](DEPLOY.md)).

## Age gate

Visitors must confirm they are **18+** before content. Preference is stored in the browser (`localStorage` key `iceluck_age_ok_18`). Implemented in site `main.js`.

## Scope reminders

- Spanish UI for Colombia / Ecuador; no e-commerce; no contact info on-site.
- Colombian alcohol legal warnings stay verbatim in the footer (see [PROJECT.md](PROJECT.md)).
