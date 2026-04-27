# PRD — Monohanzi

## 1. Product Summary

**Working title:** Monohanzi

**Product type:** A static, web-based Chinese character learning experience.

**One-line concept:** A quiet, visual character-learning site where each Hanzi is presented as a central object whose meaning, structure, examples, and related characters can be explored without dictionary clutter.

**Product thesis:** Chinese characters become easier to learn when the learner can see the character as a structured object rather than as an arbitrary glyph. Monohanzi should make each character feel inspectable, memorable, and connected to a wider system.

**Design thesis:** The interface should feel closer to a museum object page or editorial artifact page than to a dictionary, flashcard app, or dense reference tool.

---

## 2. Problem

Chinese learners often encounter one of two extremes:

1. **Reference tools with too much density**  
   Existing character tools often expose definitions, decomposition, etymology, examples, variants, and metadata all at once. They are useful, but cognitively busy.

2. **Learning apps with too little structural clarity**  
   Many apps teach recognition and recall, but do not make the internal structure of a character visually obvious.

The missing experience is a calm, high-signal page that answers:

- What does this character basically mean?
- What are its parts?
- Which part carries meaning?
- Which part carries sound, if any?
- Where does it appear in real words?
- What should I click next?

---

## 3. Product Goal

Build a minimal, beautiful, static website for learning Chinese characters one at a time.

A successful character page lets the user:

1. notice the glyph,
2. understand the core meaning,
3. inspect the character’s components directly on the glyph,
4. read 2–4 useful example words,
5. follow one meaningful link to another character, component, or word.

The product should feel calm, precise, and exploratory.

---

## 4. MVP Scope

### In scope

- 100–300 curated characters.
- One static detail page per character.
- Search by character, pinyin, English gloss, and component.
- Random character navigation.
- Curated collections.
- Cross-links between characters, components, words, semantic families, and phonetic families.
- Inspectable SVG glyphs with hoverable/focusable components.
- Static deployment to GitHub Pages.

### Out of scope for MVP

- Full dictionary coverage.
- User accounts.
- Server-side personalization.
- Heavy gamification.
- Stroke-writing practice.
- Exhaustive historical philology.
- Audio, unless trivial to add later.

---

## 5. Target Users

### Primary user: Curious beginner

A learner who wants characters to stop feeling arbitrary.

Needs:

- simple meanings,
- clear visual structure,
- a small number of useful examples,
- non-intimidating exploration.

### Secondary user: Intermediate independent learner

A learner who already uses dictionaries but wants a calmer way to review and connect characters.

Needs:

- concise structure explanations,
- semantic and phonetic relationships,
- useful examples and cross-links,
- less visual noise than a reference tool.

### Tertiary user: Design-conscious language enthusiast

A user interested in typography, writing systems, and beautiful learning tools.

Needs:

- strong visual presentation,
- careful typography,
- elegant interaction,
- meaningful curation.

---

## 6. Product Principles

1. **The glyph is the hero**  
   The character should dominate the page visually.

2. **Structure should be visible, not merely described**  
   Users should be able to hover, focus, or tap a component directly on the glyph and see what it is.

3. **Minimal means edited, not empty**  
   Every page needs enough explanation to teach, but no more than necessary.

4. **Pedagogy beats exhaustiveness**  
   Prefer the explanation that helps a learner understand the character now.

5. **Every visible part should be a doorway**  
   Components, example words, related characters, and families should be navigable.

6. **Uncertainty should be labeled**  
   When decomposition or historical explanation is approximate, say so.

7. **Static first**  
   The product should work as a fast, mostly static website with no backend dependency.

---

## 7. Core Character Page

Each character page is the central product unit.

### Required page elements

- Large central SVG glyph.
- Pinyin and tone.
- Core meaning.
- One concise gloss sentence.
- Short “how to think about it” explanation.
- Inspectable component/radical breakdown.
- 2–4 example words.
- Related characters.
- Previous / next / random navigation.

### Recommended hierarchy

1. Character glyph.
2. Core meaning.
3. Pinyin and basic metadata.
4. Component inspection.
5. Explanation.
6. Example words.
7. Related links.

### Reading rhythm

The page should support this sequence:

1. Look at the character.
2. Read the meaning.
3. Hover or tap its parts.
4. Read the short explanation.
5. Scan examples.
6. Click one next thing.

---

## 8. Inspectable Glyph Requirement

This is a core MVP requirement.

The character glyph should not be a passive font-rendered character only. It should be an inspectable SVG object whose meaningful sub-components can be highlighted.

For example, on a page for 明:

- hovering 日 highlights the 日 component,
- hovering 月 highlights the 月 component,
- the tooltip or side label explains the component,
- the component can link to its own character page,
- keyboard focus and mobile tap provide the same information.

### Terminology

Use **component** as the general product term.

Use **radical** only when referring to the dictionary radical or a historically recognized radical. Many useful visual parts are not technically the radical, so the UI should avoid implying that every sub-component is a radical.

Possible component roles:

- semantic component,
- phonetic component,
- dictionary radical,
- visual component,
- historical residue,
- uncertain or disputed component.

### Interaction requirements

Each inspectable component should support:

- hover on desktop,
- focus by keyboard,
- tap/select on mobile,
- visible highlight state,
- short label,
- short tooltip or side-panel explanation,
- optional link to a character/component page,
- accessible name for screen readers.

### Component tooltip content

Each tooltip should answer, when known:

- component character or form,
- meaning,
- role in this character,
- pronunciation clue, if relevant,
- confidence level if uncertain.

Example:

```text
日
sun / day
Role: semantic component
In 明, it contributes to the idea of brightness.
```

### Mobile behavior

Mobile should not rely on hover. Tapping a component selects it and shows the explanation below or beside the glyph. Tapping outside clears the selection.

### Accessibility behavior

A parallel component list should mirror the SVG interaction. Users should be able to tab through the component list and produce the same highlight state on the glyph.

---

## 9. SVG Alignment Requirement

The most important technical requirement for inspectable glyphs is alignment.

The highlighted sub-components must visually align with the full displayed character. The user should never feel that the component overlay is slightly off, scaled differently, or drawn from another font.

### Preferred SVG model

Use **one SVG per character** with all components drawn in the same coordinate system.

Do not compose the visible glyph from separately positioned external component SVGs unless there is a reliable generation process that guarantees shared coordinates.

Preferred structure:

```xml
<svg viewBox="0 0 1024 1024" aria-labelledby="title desc">
  <title>明</title>
  <desc>Character composed of 日 and 月.</desc>

  <g id="component-sun" data-component="日" data-role="semantic">
    <!-- paths for 日 inside 明 -->
  </g>

  <g id="component-moon" data-component="月" data-role="semantic">
    <!-- paths for 月 inside 明 -->
  </g>
</svg>
```

The full glyph is therefore the union of its component groups.

### Alignment rules

- All component paths must share the root SVG `viewBox`.
- Component paths must come from the same glyph outline, font, or source drawing.
- The rendered character must not be a separate font glyph underneath unrelated overlay paths.
- If a base outline is used, the component highlight layer must be generated from the same outline source.
- SVGs should use stable IDs that match the character data model.
- Component hit areas may be slightly enlarged for usability, but the visual highlight must remain faithful to the glyph.

### Generation strategy

Generating these SVGs is feasible, but it should be treated as a content pipeline, not as one-off artwork.

Possible pipeline:

1. Choose a canonical glyph source and font/source style.
2. Generate or import the full SVG outline for each character.
3. Segment the outline into component groups.
4. Assign each group a component ID and role.
5. Validate that all groups align within the same `viewBox`.
6. Manually review and correct important characters.
7. Store generated SVGs as static assets.

### Validation requirements

The build should fail or warn if:

- a component ID in the SVG does not exist in the character data file,
- a component in the data file has no matching SVG group,
- the SVG has inconsistent viewBox dimensions,
- a component group sits outside the viewBox,
- required accessibility labels are missing.

For higher-quality validation, compare the union of component paths against the full glyph outline. Small tolerances are acceptable, but large differences indicate a broken decomposition.

### Handling hard cases

Some characters do not split cleanly into modern visual components. Some parts overlap, mutate, compress, or preserve historical forms that are not obvious to beginners.

In those cases:

- prefer honest approximation over false precision,
- mark the component as `partial`, `visual`, or `uncertain`,
- avoid over-explaining dubious etymology,
- allow the SVG to highlight a practical visual region rather than a perfect historical component.

---

## 10. Content Model

Each character entry should be stored as structured data.

Recommended shape:

```yaml
character: 明
traditional: 明
pinyin: ming2
coreMeaning: bright
shortGloss: Brightness, light, or clarity.
explanation: 明 combines sun and moon imagery to suggest brightness and clarity.
radical: 日
strokeCount: 8
frequencyBand: common
components:
  - id: sun
    form: 日
    role: semantic
    meaning: sun / day
    note: Contributes the idea of light.
    href: /characters/日/
    confidence: high
  - id: moon
    form: 月
    role: semantic
    meaning: moon / month
    note: Reinforces the light/brightness idea.
    href: /characters/月/
    confidence: high
examples:
  - word: 明天
    pinyin: ming2 tian1
    gloss: tomorrow
  - word: 明白
    pinyin: ming2 bai5
    gloss: to understand; clear
related:
  semanticFamily: [亮, 光, 晴]
  componentFamily: [日, 月]
  confusable: []
status: published
```

### Required fields for MVP

- character,
- pinyin,
- core meaning,
- short gloss,
- explanation,
- components,
- examples,
- related links,
- SVG asset path,
- editorial status.

### Optional fields

- traditional variant,
- alternative readings,
- frequency band,
- HSK band,
- stroke count,
- historical note,
- confidence label,
- source notes.

---

## 11. Browse and Navigation

### Required browse modes

- Search.
- Random character.
- Curated collections.
- Previous / next within a collection.

### Useful collections for launch

- First 50 characters.
- First 100 everyday characters.
- Nature.
- Body.
- Time.
- Motion.
- People and family.
- Components that unlock many later characters.
- Common phonetic families.
- Easily confused pairs.

### Search requirements

Search should support:

- exact character,
- simplified/traditional form,
- pinyin with and without tone marks,
- English meaning,
- component/radical,
- example word.

Search should be local and static for MVP, using a prebuilt JSON index.

---

## 12. Static Technical Architecture

The site should be deployable as static files on GitHub Pages.

### Preferred architecture

- Static site generator or static build output.
- Character content stored as JSON, YAML, or Markdown with frontmatter.
- Generated HTML pages for every character and collection.
- Static SVG assets for glyphs.
- Static JSON search index.
- No backend required for core experience.

### Suitable implementation options

Any of the following are acceptable:

- Astro with static output,
- Vite with pre-rendered routes,
- Eleventy,
- plain static HTML generated by scripts,
- another static-site generator with predictable output.

Avoid introducing a server-rendered framework unless it exports clean static files.

### Deployment requirements

- Build output should deploy to GitHub Pages.
- The site must work under a project subpath, e.g. `/monohanzi/`, unless using a custom domain.
- All internal links and asset paths must respect the configured base path.
- The repository should include a simple build command and deployment workflow.
- No private or licensed source data should be committed if the repo is public.

### Data and asset pipeline

Recommended directories:

```text
/content/characters/*.yaml
/content/collections/*.yaml
/assets/glyphs/*.svg
/scripts/generate-search-index.ts
/scripts/validate-glyphs.ts
/src/
/dist/
```

### Client-side JavaScript

Use JavaScript for:

- SVG component hover/focus/tap states,
- local search,
- random navigation,
- optional local favorites.

Core page content should remain readable without heavy client-side rendering.

### Favorites

Favorites are optional for MVP. If included, use `localStorage` only. Do not add accounts or authentication for launch.

---

## 13. Design Requirements

### Visual direction

The interface should feel like:

- a museum object page,
- an editorial object study,
- a quiet learning tool,
- a refined typographic website.

### UI requirements

- One dominant glyph.
- Generous whitespace.
- Strong but simple typography.
- Restrained color palette.
- Minimal chrome.
- Subtle hover and focus states.
- Clear mobile layout.
- No dashboard-like density.

### Component highlighting

The component highlight should be calm and legible.

Requirements:

- selected component is visibly distinct,
- non-selected components may fade slightly,
- labels should not cover the glyph awkwardly,
- the effect should feel explanatory, not flashy,
- reduced-motion mode should disable animated transitions.

---

## 14. Editorial Guidelines

Each character page should be short.

### Copy limits

- Core meaning: 1–4 words.
- Short gloss: one sentence.
- Main explanation: 1–3 short sentences.
- Component note: 1–2 short sentences per component.
- Examples: 2–4 words.
- Historical note: optional and secondary.

### Explanation style

Write for clarity first.

Prefer:

- concrete language,
- short sentences,
- high-confidence claims,
- visible distinctions between meaning, sound, and history.

Avoid:

- long philological debates,
- too many derived meanings,
- decorative prose,
- excessive metadata,
- pretending an uncertain decomposition is certain.

---

## 15. Success Metrics

### North-star metric

**Meaningfully explored characters per session.**

A character is meaningfully explored when a user:

- opens a character page,
- interacts with at least one component, example, or related link,
- and continues to another page or collection item.

### Secondary metrics

- Search success rate.
- Random-to-next clickthrough rate.
- Component hover/tap rate.
- Average character pages per session.
- Collection completion rate.
- Return visits.
- User-reported clarity.

### Qualitative signals

Users describe the product as:

- beautiful,
- calm,
- clear,
- memorable,
- less intimidating than a dictionary.

---

## 16. Risks and Mitigations

### Risk: SVG generation becomes too time-consuming

Mitigation:

- start with a small curated corpus,
- prioritize high-value characters,
- automate simple cases,
- manually correct important pages,
- allow non-inspectable fallback pages for hard cases only if clearly marked.

### Risk: Components do not align perfectly

Mitigation:

- use one SVG coordinate system per character,
- generate component groups from the same outline source,
- validate SVG/data consistency in the build,
- manually inspect MVP glyphs.

### Risk: Minimalism becomes under-explanation

Mitigation:

- require core meaning, component explanation, and examples on every page,
- test whether users can explain the character after reading the page.

### Risk: The product drifts into a dictionary clone

Mitigation:

- keep strict copy limits,
- avoid exhaustive metadata in the default view,
- preserve the object-centered page hierarchy.

### Risk: Etymology is misleading

Mitigation:

- label uncertain explanations,
- distinguish visual mnemonic from historical origin,
- avoid presenting folk etymology as fact.

---

## 17. Roadmap

### Phase 0 — Prototype

- Build 5–10 polished character pages.
- Test SVG component highlighting.
- Validate alignment strategy.
- Test desktop hover, keyboard focus, and mobile tap.
- Confirm content format and build pipeline.

### Phase 1 — MVP

- 100–300 character pages.
- Search.
- Random mode.
- Curated collections.
- Static GitHub Pages deployment.
- Inspectable SVGs for priority characters.
- Method page explaining components and uncertainty.

### Phase 2 — Improvement

- More collections.
- Better phonetic family pages.
- Confusable-pair pages.
- Local favorites.
- More polished SVG generation and validation.
- Optional audio.

### Phase 3 — Advanced Learning

- Sentence examples.
- Stroke overlays.
- Personalized paths.
- Teacher/editor tooling.
- Public data export or API.

---

## 18. Final Product Definition

Monohanzi is a curated, static, object-centered learning experience for Chinese characters.

Its core differentiator is not dictionary completeness. Its differentiator is the combination of:

- a beautiful one-character page,
- direct inspection of the character’s visible components,
- concise pedagogical explanation,
- useful examples,
- and meaningful linked exploration.

The MVP should prove that a learner can look at a character, hover or tap its parts, understand why it looks the way it does, and naturally continue to the next related character.
