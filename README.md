# Monohanzi

A quiet, visual Chinese character learning site. The current Phase 0 prototype
contains five inspectable character pages chosen to exercise different kinds of
structure.

## Run locally

You need Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

Open [http://localhost:4321/](http://localhost:4321/) in your browser. Astro
prints the exact address if that port is already occupied. The local development
command deliberately serves from `/`; production continues to build beneath
the GitHub Pages base path `/monohanzi/`.

To test the production output locally:

```sh
npm run build:local
npm run preview
```

## Checks

```sh
npm run validate:glyphs
npm test
```

The validator checks the Phase 0 publication contract: data and SVG component
IDs, coordinate bounds, accessibility markup, review state, provenance, source
references, examples, and related-page links.

## Prototype contents

- `家` — compressed/historical component form
- `明` — meaning-based visual pairing
- `妈` — semantic–phonetic structure
- `问` — enclosing structure
- `东` — deliberately visual and uncertain split

The current five SVGs preserve HanziVG’s original stroke paths and adapt only
their component groups, IDs, and accessibility metadata. They are separately
licensed under CC BY-SA 3.0; see `ASSET_LICENSES.md` and the in-app Method and
Credits pages.
