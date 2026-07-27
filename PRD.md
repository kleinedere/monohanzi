# PRD — Monohanzi

## 1. Product Definition

Monohanzi is a static, visual Chinese character learning site. Each Hanzi is
presented as a central object whose meaning, visible structure, examples, and
relationships can be explored without dictionary clutter.

The primary audience is the curious beginner who wants characters to stop
feeling arbitrary. Intermediate learners are a secondary audience: they may
already use dictionaries, but want a calmer way to review structure and make
connections.

A successful character page lets a learner:

1. notice the glyph,
2. understand its core meaning,
3. inspect meaningful components directly on the glyph,
4. read 2–4 useful example words, and
5. continue to a related published character or collection.

The interface should feel closer to a museum object page or editorial artifact
study than to a dictionary, dashboard, or flashcard app.

### Product principles

1. **The glyph is the hero.** Use one dominant character, generous whitespace,
   restrained color, and minimal interface chrome.
2. **Structure is directly inspectable.** Meaningful parts must be selectable on
   the glyph, not only described in surrounding text.
3. **Minimal means edited, not empty.** Every page teaches enough to be useful,
   while strict copy limits prevent dictionary-like density.
4. **Pedagogy does not override evidence.** Prefer a clear explanation, but
   distinguish structural role, visual mnemonic, and historical origin. Label
   uncertainty instead of presenting folk etymology as fact.
5. **Every link leads somewhere useful.** Components, examples, related
   characters, navigation, and collections should encourage deliberate
   exploration without dead ends.

## 2. Delivery Scope

### Phase 0 — five-character gate

Before scaling content production, publish five polished character pages that
collectively exercise:

- a primarily semantic decomposition,
- a semantic–phonetic decomposition,
- an enclosing component,
- a compressed or visually mutated component, and
- an uncertain or disputed decomposition.

`家` is the existing first slice and may fill one of these cases after its asset
and claims pass the same review required of the other four. Phase 0 must confirm
the HanziVG conversion workflow, content model, validation, desktop hover,
keyboard focus, mobile tap, reduced-motion behavior, and editorial review.

### Phase 1 — public MVP

The MVP contains exactly 100 published, curated characters and includes:

- one static detail page and inspectable SVG per character,
- simplified-character canonical routes,
- display and search support for known traditional equivalents,
- local search by character, traditional form, pinyin with or without tone
  marks, English gloss, component/radical, and example word,
- random character navigation,
- previous/next navigation within curated collections,
- collections for useful themes and component or phonetic families,
- links between published characters and components,
- a method page explaining component terminology, evidence, and uncertainty,
- a public asset credits/license page, and
- static deployment to GitHub Pages beneath `/monohanzi/`.

The MVP does not include full dictionary coverage, separate traditional glyph
pages, accounts, personalization, gamification, stroke-writing practice,
analytics, or exhaustive philology. Favorites, audio, sentence examples, stroke
overlays, and teaching tools may be considered after the MVP.

## 3. Character Page and Interaction Contract

Each page must contain a large SVG glyph, pinyin and tone, core meaning, one
short gloss, a concise “how to think about it” explanation, component details,
2–4 example words, related published content, and previous/next/random
navigation.

The reading order is: see the character, understand the basic meaning, inspect
its parts, read the explanation, scan examples, and choose one next destination.
Core page content remains readable without heavy client-side rendering.

### Component terminology and content

Use **component** as the general product term. Use **radical** only for the
dictionary radical or a sourced, historically recognized radical. Component
roles use this controlled set:

- `semantic` — contributes a meaning category,
- `phonetic` — contributes a pronunciation clue,
- `radical` — identifies the dictionary radical when that fact is useful,
- `visual` — a practical visible region without a stronger linguistic claim,
- `historical` — relevant to an attested earlier analysis or form, and
- `uncertain` — disputed or insufficiently supported.

Each component provides its form, learner-facing meaning, one or more controlled
roles, short note, confidence, source references, and an optional link. Notes
must not conflate a modern visual
mnemonic with historical origin. Structural and historical claims require cited
source notes and human editorial approval.

### Inspectable behavior

Every published character has one SVG in which the complete visible glyph is
the union of its component groups. All paths share one root coordinate system;
the UI must not place unrelated overlays over a separately rendered font glyph.

Each component supports desktop hover, keyboard focus and activation, mobile
tap, a visible selected state, an accessible name, and a synchronized detail
panel. A parallel component button list must expose the same state without
requiring direct SVG interaction. Tapping outside or pressing Escape clears the
selection. Labels must not obscure the glyph, and reduced-motion preferences
must suppress nonessential transitions.

Component and related-character links are active only when their destination is
published. An unpublished relation is rendered as a non-link or omitted; it
must never create a broken route.

## 4. Glyph Source and Editorial Pipeline

[Connum/HanziVG](https://github.com/Connum/hanzivg) is the default upstream
source for stroke geometry and initial component grouping. HanziVG metadata is
evidence, not editorial truth: Chinese form, stroke geometry, group boundaries,
component roles, and any historical interpretation must be reviewed before an
asset is publishable.

For each character:

1. Locate the source SVG by Unicode code point and pin the upstream revision.
2. Prefer a verified Chinese HanziVG asset; do not silently substitute a
   Japanese form when the Chinese glyph or stroke convention differs.
3. Preserve the source paths and shared coordinates while selecting the groups
   that are pedagogically useful at Monohanzi’s page level.
4. Normalize the SVG viewBox, stable component IDs, classes, focus behavior,
   accessible labels, title, and description.
5. Match SVG component IDs to structured character data and run automated
   validation.
6. Review the rendered full glyph and every highlight state, then review
   component claims, citations, uncertainty labels, and provenance.
7. Mark the entry `published` only after all technical and editorial checks
   pass.

If HanziVG is missing, visibly unsuitable, or grouped in a way that cannot
support the teaching goal, create or correct the SVG manually. `svg_prompt.md`
is an auxiliary fallback guide, not an authoritative source. Original or
generated geometry must satisfy exactly the same alignment, accessibility,
provenance, and review requirements.

Hard cases may use a practical visual grouping when a clean modern or historical
split is impossible, but the role must be `visual` or `uncertain` and the note
must describe the limitation. A passive, unsegmented glyph is not an MVP
fallback: the character remains a draft.

### Licensing and attribution

HanziVG is distributed under CC BY-SA 3.0. Imported or adapted glyph assets must
retain required attribution and be distributed under compatible ShareAlike
terms. This asset obligation is documented separately from the repository’s MIT
software license. Confirm compliance before public distribution; this PRD is
product guidance, not legal advice.

Every derived glyph records its upstream repository, source path, pinned commit
or release, source license, whether Monohanzi modified it, and review status.
The deployed site also provides a project-level credits/license page.

## 5. Content and Publication Contract

Character content lives in structured JSON. Simplified characters are canonical;
`traditional` stores a known equivalent for display and search, without creating
a separate page in the MVP.

The existing character fields remain: slug, character, traditional form,
pinyin, display pinyin, meaning, gloss, explanation, radical, stroke count,
frequency band, components, examples, related entries, glyph metadata, and
editorial status. Replace free-form component `role` with a `roles` array whose
values come from the controlled role set above. Add a character-level `sources`
array of stable IDs, titles, URLs or publication references, and short notes;
components refer to those IDs through `sourceRefs`.

Glyph metadata additionally records:

```text
source: { repository, path, revision, license, modified }
review: { technical, visual, editorial }
```

The existing `glyph.sourcePath` remains the local Monohanzi asset path;
`glyph.source.path` identifies the upstream file.

Each review value is `pending` or `approved`; only `approved` is publishable.
The main explanation cites the relevant character sources, while every
structural or historical component claim includes at least one `sourceRefs`
entry. This makes every non-obvious claim traceable without displaying citations
inside the primary reading flow.

`status: published` is a strict contract. It requires:

- complete required copy within the editorial limits,
- 2–4 useful examples and at least one valid next destination,
- an inspectable, visually reviewed SVG,
- exact agreement between SVG and data component IDs,
- required accessibility metadata and behavior,
- cited and reviewed structural or historical claims,
- complete asset provenance, and
- passing automated validation and production build.

Any missing asset, unsuitable form, ambiguous unlabeled grouping, incomplete
citation, broken destination, or failed check keeps the entry in `draft`.

### Editorial limits

- Core meaning: 1–4 words.
- Short gloss: one sentence.
- Main explanation: 1–3 short sentences.
- Component note: 1–2 short sentences.
- Examples: 2–4 per character.
- Historical material: optional, sourced, and secondary.

Use concrete language and distinguish meaning, sound, visual analogy, and
history. Avoid long debates, decorative prose, exhaustive metadata, and claims
whose confidence cannot be communicated honestly.

## 6. Technical Architecture

Monohanzi uses Astro with static output, TypeScript, structured JSON character
data, inline static SVG assets, a generated local JSON search index, and
client-side JavaScript only for glyph interaction, search, and navigation.
Routes and assets must respect Astro’s configured base path. GitHub Pages is the
deployment target.

Keep the current repository layout: character data under `src/data/`, glyphs
under `src/assets/glyphs/`, pages and components under `src/`, and pipeline or
validation utilities under `scripts/`. Do not introduce a backend for core MVP
behavior.

The build must reject published entries when an SVG is missing, viewBox or
coordinates violate the asset contract, component IDs differ between data and
SVG, stable IDs or accessibility labels are absent, provenance/review fields are
incomplete, or a published internal link cannot resolve. Visual correctness and
claim accuracy remain explicit human review gates because structural validation
cannot prove them.

## 7. Acceptance Criteria

Phase 0 is complete when all five structural cases pass data/SVG validation,
coordinate checks, production build, desktop and mobile interaction checks,
keyboard and screen-reader-oriented review, reduced-motion review, visual glyph
review, citation review, and provenance review. The pipeline must demonstrate a
documented path for both a usable HanziVG source and a missing or unsuitable one.

The MVP is complete when:

- exactly 100 character entries satisfy the publication contract,
- every published page has a reviewed inspectable glyph,
- search handles simplified and stored traditional forms plus all specified
  metadata,
- random and collection navigation lead only to published pages,
- all published component and related links resolve,
- the method and asset credits/license pages are present,
- automated validation and the static production build pass, and
- the built site works beneath `/monohanzi/` on GitHub Pages.

No analytics or formal measurement program is required. Product quality is
defined by these observable content, interaction, accessibility, provenance,
and deployment outcomes.
