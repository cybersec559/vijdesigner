# Atelier, end to end

This is the record of the vijdesigner site: what it is for, what was built, and how a photograph becomes a published piece.

## Purpose

The site is a storefront for handmade jewelry and crafts, built to feel like walking into the shop rather than paging through a catalog. Motion carries the visit. The studio exists so a new photograph can become a named piece, with a story and an ad, without leaving the project.

The brand on the site is Atelier. The line is "Handmade jewelry and crafts, shaped by hand."

There is no checkout. The site shows the work and tells the story of each piece. Buying is out of scope.

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4
- `motion` for the homepage entrance and the collection reveal
- Vercel AI SDK, through the AI Gateway, model `openai/gpt-5.4`
- Local files for content: `data/pieces.json` and `public/uploads`
- Fraunces for display type, Outfit for the rest
- Palette: warm paper (`#f6f1ea`), ink (`#14110e`), gold (`#9a7340`)

Pages that read the collection are `force-dynamic`, so a publish appears on the next request.

## The visit

`app/page.tsx` reads the collection and renders the header over `HomePage`.

1. **Scroll campaign.** `components/scroll-campaign.tsx` pins a full-viewport stage. The track is one viewport tall per design. Scroll progress picks the active slide, and the photographs crossfade. The first slide is the combined portrait, `/uploads/blossom-together.jpg`, captioned "Come in. Worn together." and linked to both First Blossom and Throat Blossom. The next slides are the earring, the pendant, then every other piece in collection order. The header stays clear while this stage is on screen, then turns solid once the visitor has scrolled past it.
2. **Stories.** Short essays for First Blossom and Throat Blossom sit under the campaign.
3. **Marquee.** A slow line of words: Blossom, Gold, Enamel, Daisy.
4. **Collection** (`#collection`). An uneven grid. The first piece is the widest. Each card links to its story page.
5. **Window** (`#window`). Alternating photograph and ad copy, written from the piece itself.
6. **Piece page** (`/pieces/[id]`). The photograph stays with the story. The ad line is set as a pull quote.

If the collection is empty, the homepage says the bench is clear and points the maker to the studio.

## The opening pieces

The collection ships with six pieces, newest first:

| Piece | Category | Photograph |
| --- | --- | --- |
| Throat Blossom | Pendant | `blossom-pendant.jpg` |
| First Blossom | Earrings | `blossom-worn.jpg` |
| River Link | Necklace | `linen-necklace.jpg` |
| Two Clays | Earrings | `clay-earrings.jpg` |
| Moss Setting | Ring | `river-ring.jpg` |
| Three Turns | Bracelet | `thread-cuff.jpg` |

First Blossom began as a photograph of pink enamel flowers on the bench: three blossoms edged in gold, a pale daisy beside them. That photograph is `blossom-charms.jpg`. The storefront uses the worn portraits instead. Throat Blossom is the same flower on a fine gold chain, at the throat. The homepage opens on both, worn together, in `blossom-together.jpg`.

The other four pieces are seed work: a hammered gold chain with a river stone, unglazed clay earrings, a silver ring with a rough green stone, and three linen cuffs.

A piece always has a name, category, materials, a first-person story, an ad headline, an ad body, a social caption, alt text, an id, an image path under `/uploads`, and a `createdAt` time. The shape is `pieceSchema` in `lib/types.ts`.

## From a photograph to the site

The studio is the path for a new piece.

1. The maker opens `/studio`. If `STUDIO_PASSWORD` is unset, the gate says the studio is not configured. Otherwise it asks for the password.
2. `POST /api/studio/login` compares the password with a timing-safe digest and sets an httpOnly cookie, `atelier_studio`, for 14 days. Logout clears it. Generate and publish both refuse the request with 401 when the cookie is missing or wrong.
3. On the board, the maker drops photographs. Each one becomes a draft with a local preview. Generate, or Generate all, posts the file to `POST /api/generate`.
4. Generate checks the session, then requires `AI_GATEWAY_API_KEY`. The route sends the image bytes and a maker-voice prompt to `openai/gpt-5.4` and asks for an object that matches `copySchema`: name, category, materials, story, ad headline, ad body, social caption, and alt text. The prompt tells the model to describe only what is visible and to skip stock luxury lines. If the key is missing, the route returns 503 and says to add it and restart. The maker can still type every field and publish.
5. Publish posts the image and the edited fields to `POST /api/pieces`. The image is checked again (JPEG, PNG, WebP, or GIF, under 8 MB), saved as a random id under `public/uploads`, and the piece is inserted at the front of `data/pieces.json`. Writes are queued so two publishes cannot overwrite each other. The image path must stay inside `/uploads`.
6. The homepage and the piece page read that file on the next request.

`GET /api/pieces` returns the collection and does not require a session.

## What was decided along the way

- The first homepage was a motion gallery. It was then rebuilt as one full-bleed campaign so the shop feels opened, not templated.
- The bench photograph of the pink blossoms became the First Blossom story. The storefront photograph is the earring worn, not the overhead bench shot.
- The pendant was given its own worn portrait, Throat Blossom.
- The homepage campaign keeps both pieces. They are one photograph, not two portraits side by side.
- Scrolling the homepage changes that photograph through the other designs, instead of adding a second gallery above the collection.
- Copy is generated from the photograph through the AI Gateway. The project does not call a provider SDK directly.
- Content stays in the repo as JSON and image files. There is no database.

## Run and publish

Locally:

```bash
npm install
cp .env.example .env.local
npm run dev -- --hostname 127.0.0.1 --port 3456
```

`.env.local` is gitignored. `.env.example` lists the two variables and leaves them blank.

| Variable | Used for |
| --- | --- |
| `STUDIO_PASSWORD` | Signing into `/studio` |
| `AI_GATEWAY_API_KEY` | Generating copy from a photograph |

The public repository is [cybersec559/vijdesigner](https://github.com/cybersec559/vijdesigner).
