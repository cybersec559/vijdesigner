# vijdesigner

Atelier is a handmade jewelry and crafts site. Visitors browse a campaign and a collection. The maker uses a private studio to drop in a photograph, generate ad copy from that image, edit it, and publish the piece onto the site.

This is a showcase. There is no cart and no checkout.

## Run it locally

```bash
npm install
cp .env.example .env.local
npm run dev -- --hostname 127.0.0.1 --port 3456
```

Open [http://127.0.0.1:3456](http://127.0.0.1:3456).

| Path | What it is |
| --- | --- |
| `/` | Scroll campaign, collection, and window |
| `/pieces/[id]` | One piece, with its photograph and story |
| `/studio` | Password gate, then the upload board |

Set `STUDIO_PASSWORD` in `.env.local` before signing into the studio. Copy generation also needs `AI_GATEWAY_API_KEY`. Without that key, the studio still lets you type the copy and publish. Generate returns a clear error until the key is present and the dev server is restarted.

## What a visitor sees

The homepage opens on one pinned photograph. Scrolling crossfades it through the other designs: the pieces worn together, then First Blossom, Throat Blossom, and the rest of the collection. The caption and the link change with the photograph. After the last design, the page continues into the stories, a marquee, the collection grid, and the window.

Each piece page keeps the photograph beside the maker's story and the ad line.

`prefers-reduced-motion` skips the long pinned scroll and shows the first photograph only.

## Studio

1. Sign in at `/studio`.
2. Drop one or more photographs. JPEG, PNG, WebP, and GIF are accepted, up to 8 MB.
3. Generate copy for one image, or generate all. The draft stays editable.
4. Publish. The image is stored under `public/uploads`, and the piece is written to the front of `data/pieces.json`.

Published pieces show up on the homepage without a rebuild.

## Where the code lives

```
app/page.tsx                 homepage
app/pieces/[id]/page.tsx     piece story
app/studio/page.tsx          studio
app/api/generate/route.ts    vision copy
app/api/pieces/route.ts      list and publish
app/api/studio/             login and logout
components/scroll-campaign.tsx
components/home-page.tsx
components/studio-board.tsx
data/pieces.json             the collection
public/uploads/              photographs
lib/pieces.ts                read and write the collection
lib/uploads.ts               image checks and storage
lib/studio-auth.ts           studio session
site.config.ts               name, tagline, navigation
```

The end-to-end record of how the site was built is in [docs/PROJECT.md](docs/PROJECT.md).
