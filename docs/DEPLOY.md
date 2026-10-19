# Deploy

**Snapshot:** October 2026.

Publishes the static site to Cloudflare Pages project **`iceluck`**. Do **not** put API tokens, passwords, or other secrets in this repo or in chat logs.

## Prerequisites (on the build box)

- Node / `npx` available.
- Wrangler able to authenticate (typically `CLOUDFLARE_API_TOKEN` in the environment — **never print it**).
- `CLOUDFLARE_ACCOUNT_ID` set to the account that owns the `iceluck` Pages project.
- Optional: `WRANGLER_CACHE_DIR` pointed at a writable cache directory on the box if the default cache path is not usable.

The Cloudflare connector used by agents is **not** the deploy path; use Wrangler as below.

## Stage

1. Freeze or rename the previous live snapshot if your process keeps one (e.g. move `iceluck-v3-live` aside, then copy the new build into a fresh read-only `iceluck-v3-live` after a successful deploy).
2. Copy the site into staging, **excluding** non-public folders such as `screenshots/` and `frames/`:

   - Source: `/workspace/iceluck-v3/` (or the tree you intend to ship)
   - Destination: `/workspace/iceluck-deploy/public/`

   Required in `public/`: `index.html`, `styles.css`, `main.js`, and `assets/` (images and any logo SVGs you ship).

3. Cache-bust static CSS/JS when content changed, e.g. query on the link/script in `index.html`:

   - `styles.css?v=YYYYMMDD-label`
   - `main.js?v=YYYYMMDD-label`

## Publish

From `/workspace` (adjust paths if needed):

```bash
export CLOUDFLARE_ACCOUNT_ID="<account-id>"   # already on the box; do not commit
export WRANGLER_CACHE_DIR=/workspace/.wrangler-cache

npx -y -p node@22 -p wrangler@latest wrangler pages deploy \
  /workspace/iceluck-deploy/public \
  --project-name iceluck \
  --branch main \
  --commit-dirty=true
```

Wrangler prints a deployment URL such as `https://<hash>.iceluck.pages.dev` when finished.

There may also be a `wrangler.jsonc` under `/workspace/iceluck-deploy/` used for other Workers/assets experiments; **Pages deploys for this site use the `pages deploy` command and project name `iceluck`**, not a Worker route rewrite of the marketing site.

## Verify

Check **all** of:

- `https://ice-luck.com`
- `https://www.ice-luck.com`
- The new `*.iceluck.pages.dev` deployment URL

Suggested checks:

- HTML **200**.
- Expected strings present (e.g. inline SVG logo ids, footer copyright, both legal warnings).
- CSS **200** and contains current brand tokens (e.g. `#FCD116` when that is live).
- No disallowed strings (e.g. “marca de TuskerMind”, logo snowflake markup, removed font files).
- Packet/box assets **200** with sensible content types (`image/webp`, `image/jpeg`, `image/svg+xml` as applicable).

If apex/www still show an old CSS/JS hash, confirm the HTML cache-buster query and wait for CDN caches or hard-refresh; do not change unrelated DNS records.

## DNS

Custom domains for ice-luck.com / www are already on Cloudflare for this project. **Do not** delete or overwrite unrelated DNS records or zones, and do not touch other projects’ domains. If a conflicting record appears on ice-luck.com, stop and report rather than overwriting.
