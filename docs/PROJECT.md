# Project overview

**Snapshot:** October 2026.

## Goals

Introduce IceLuck as a frozen-cocktail brand: ready-to-freeze packets, light ABV, sun-and-weekend mood. The site explains the product and flavors; it does not sell.

## Audience

Adults of legal drinking age in **Colombia** and **Ecuador**. Copy is Spanish and uses **tú**.

## Product (as stated on the site)

- Format: frozen cocktails in 150 ml packets.
- Strength: **6% Alc. Vol.**
- Origin: **Medellín, Colombia**.
- Keep frozen at **-18 °C or colder**.

### Flavors

| Flavor | Notes on site |
|--------|----------------|
| Piña Colada | Coco · Piña |
| Margarita Premium | Limón suave |
| Margarita Clásica | Limón intenso |
| Mojito | Hierbabuena · Limón · Hielo |

## Scope — in

- Single static marketing page (hero, flavors, how to enjoy, short story, footer).
- 18+ age gate.
- Official logo (SVG) and product photography of packets / 4-pack box.
- Colombian legal health warnings in the footer.
- WCAG AA contrast targets for primary UI (black / yellow / white).

## Scope — out (current constraints)

Do **not** add without explicit approval:

- Selling, pricing, stock, store locator, or e-commerce.
- Contact info, forms, or email signup.
- Instagram, WhatsApp, or other social links on the site.
- Model / lifestyle photography beyond the approved packet and box shots.

These are product decisions, not missing features.

## Language and tone

- Primary UI and body copy: Spanish.
- Official logo tagline on the mark: English **FROZEN COCKTAILS** (part of the designer logo).
- Age gate, legal lines, and responsibility copy stay in Spanish.

## Legal footer warnings (verbatim)

These two lines must stay exactly as written:

1. `Prohíbase el expendio de bebidas embriagantes a menores de edad.`
2. `El exceso de alcohol es perjudicial para la salud.`

Also present: a short responsibility paragraph, “Disfruta con responsabilidad. Solo para mayores de 18 años,” and the copyright line crediting IceLuck with website development by TuskerMind (IceLuck is not described as a TuskerMind brand).

## Status

**v1 is live** on ice-luck.com / www.ice-luck.com via Cloudflare Pages project `iceluck`. Working tree and frozen live snapshot live on the build box under `/workspace/iceluck-v3` and `/workspace/iceluck-v3-live` (see Architecture).
