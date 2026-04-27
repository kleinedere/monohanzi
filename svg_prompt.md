# SVG Generation Prompt For Monohanzi

Use this prompt when asking an LLM to generate an inspectable SVG glyph asset for Monohanzi. Replace the values in the **Character Brief** section for each new character.

## Prompt Template

```text
Generate one inline SVG asset for a Monohanzi Chinese character page.

The SVG must be valid UTF-8 XML/SVG markup. Return only the SVG code, with no Markdown fence and no explanation.

Character Brief
- Character: {{CHARACTER}}
- Slug: {{SLUG}}
- ViewBox: 0 0 1024 1024
- Component groups:
{{COMPONENT_LIST}}

Strict SVG Requirements
1. Use exactly one root <svg> element.
2. The root must include:
   - class="glyph-svg"
   - viewBox="0 0 1024 1024"
   - role="img"
   - aria-labelledby="{{SLUG}}-title {{SLUG}}-desc"
   - xmlns="http://www.w3.org/2000/svg"
3. Add a <title id="{{SLUG}}-title">{{CHARACTER}}</title>.
4. Add a concise <desc id="{{SLUG}}-desc"> that names the character and its component groups.
5. Put each inspectable component inside its own <g> group.
6. Every component <g> must include:
   - id="component-{{COMPONENT_ID}}"
   - class="glyph-component"
   - data-component-id="{{COMPONENT_ID}}"
   - tabindex="0"
   - role="button"
   - aria-label="{{COMPONENT_FORM}}, {{COMPONENT_MEANING}}, {{COMPONENT_ROLE}}"
7. The data-component-id values must exactly match the component IDs provided in the brief.
8. Draw each component using <path> elements inside its component <g>.
9. All paths must share the root SVG coordinate system. Do not use nested <svg> elements.
10. Do not use <text>, external fonts, images, raster data, CSS, scripts, masks, filters, or external references.
11. Do not draw a separate full-character background underneath the components. The complete character must be the visual union of the component groups.
12. Keep all meaningful coordinates inside the 0..1024 viewBox. A small stroke overshoot is acceptable.
13. Use stroke-based paths that look like a calm, legible handwritten/brush outline:
    - fill="none" is optional because app CSS applies it, but do not depend on fills.
    - paths should work with stroke-linecap="round" and stroke-linejoin="round".
14. Make the component groups visually align into one coherent character. The learner should feel they are inspecting one glyph, not assembled clip art.
15. The SVG must be ready to paste into src/assets/glyphs/{{SLUG}}.svg.

Quality Bar
- The character should be recognizable at large size.
- Component boundaries should be pedagogically clear.
- The component shapes may be simplified, but they must preserve the character's basic structure.
- If a component is historical or approximate, still draw the practical visible region that helps a learner inspect the glyph.
```

## Current Prompt: `家`

```text
Generate one inline SVG asset for a Monohanzi Chinese character page.

The SVG must be valid UTF-8 XML/SVG markup. Return only the SVG code, with no Markdown fence and no explanation.

Character Brief
- Character: 家
- Slug: jia
- ViewBox: 0 0 1024 1024
- Component groups:
  - Component ID: roof
    Component form: 宀
    Component meaning: roof / house
    Component role: semantic component
    Visual region: the top roof-like strokes of 家
  - Component ID: pig
    Component form: 豕
    Component meaning: pig
    Component role: historical / visual component
    Visual region: the lower 豕-like body of 家 beneath the roof

Strict SVG Requirements
1. Use exactly one root <svg> element.
2. The root must include:
   - class="glyph-svg"
   - viewBox="0 0 1024 1024"
   - role="img"
   - aria-labelledby="jia-title jia-desc"
   - xmlns="http://www.w3.org/2000/svg"
3. Add a <title id="jia-title">家</title>.
4. Add a concise <desc id="jia-desc"> that names 家 and its two component groups: 宀 above and a 豕-like form below.
5. Put each inspectable component inside its own <g> group.
6. The roof component <g> must include:
   - id="component-roof"
   - class="glyph-component"
   - data-component-id="roof"
   - tabindex="0"
   - role="button"
   - aria-label="宀, roof or house, semantic component"
7. The pig component <g> must include:
   - id="component-pig"
   - class="glyph-component"
   - data-component-id="pig"
   - tabindex="0"
   - role="button"
   - aria-label="豕, pig, historical and visual component"
8. Draw each component using <path> elements inside its component <g>.
9. All paths must share the root SVG coordinate system. Do not use nested <svg> elements.
10. Do not use <text>, external fonts, images, raster data, CSS, scripts, masks, filters, or external references.
11. Do not draw a separate full-character background underneath the components. The complete character must be the visual union of the roof and pig component groups.
12. Keep all meaningful coordinates inside the 0..1024 viewBox. A small stroke overshoot is acceptable.
13. Use stroke-based paths that look like a calm, legible handwritten/brush outline:
    - fill="none" is optional because app CSS applies it, but do not depend on fills.
    - paths should work with stroke-linecap="round" and stroke-linejoin="round".
14. Make the two component groups visually align into one coherent 家. The learner should feel they are inspecting one glyph, not assembled clip art.
15. The SVG must be ready to paste into src/assets/glyphs/jia.svg.

Quality Bar
- 家 should be recognizable at large size.
- 宀 should clearly read as the top roof component.
- The lower 豕-like component should be visually connected to the traditional explanation without overcomplicating the form.
- The component boundary between roof and lower form should be clear when either group is highlighted.
```

## Replacement Checklist

When generating a different asset:

1. Replace `{{CHARACTER}}` with the target character.
2. Replace `{{SLUG}}` with the file/page slug, such as `ming` or `wo`.
3. Replace `{{COMPONENT_LIST}}` with the exact component IDs, forms, meanings, roles, and visual regions.
4. Make sure every component ID also exists in `src/data/characters.json`.
5. Save the returned SVG as `src/assets/glyphs/{{SLUG}}.svg`.
6. Run `npm run validate:glyphs` after adding or editing the SVG.
