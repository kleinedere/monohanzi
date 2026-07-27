import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const charactersPath = path.join(root, "src", "data", "characters.json");
const characters = JSON.parse(readFileSync(charactersPath, "utf8"));
const failures = [];
const allowedRoles = new Set([
  "semantic",
  "phonetic",
  "radical",
  "visual",
  "historical",
  "uncertain"
]);
const publishedSlugs = new Set(
  characters.filter((character) => character.status === "published").map((character) => character.slug)
);

function fail(character, message) {
  failures.push(`${character.character} (${character.slug}): ${message}`);
}

function componentBlocks(svg) {
  return [...svg.matchAll(/<g\b(?=[^>]*data-component-id="([^"]+)")[\s\S]*?<\/g>/g)].map(
    (match) => ({
      id: match[1],
      block: match[0]
    })
  );
}

function numericCoordinates(block) {
  const pathLikeAttributes = [...block.matchAll(/\b(?:d|x|y|x1|x2|y1|y2|cx|cy|points)="([^"]+)"/g)]
    .map((match) => match[1])
    .join(" ");

  return [...pathLikeAttributes.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) =>
    Number(match[0])
  );
}

const duplicateSlugs = characters
  .map((character) => character.slug)
  .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

if (duplicateSlugs.length > 0) {
  failures.push(`Duplicate character slug(s): ${[...new Set(duplicateSlugs)].join(", ")}`);
}

if (publishedSlugs.size < 5) {
  failures.push("Phase 0 requires at least five published character entries");
}

for (const character of characters) {
  const sourceIds = new Set((character.sources ?? []).map((source) => source.id));

  if (character.status === "published") {
    if (!character.components?.length) {
      fail(character, "published entry has no components");
    }

    if (character.examples?.length < 2 || character.examples.length > 4) {
      fail(character, "published entry must have 2–4 examples");
    }

    if (!character.related?.some((related) => related.href)) {
      fail(character, "published entry needs at least one linked next destination");
    }

    for (const reviewName of ["technical", "visual", "editorial"]) {
      if (character.glyph?.review?.[reviewName] !== "approved") {
        fail(character, `glyph ${reviewName} review is not approved`);
      }
    }
  }

  for (const field of ["repository", "path", "revision", "license"]) {
    if (!character.glyph?.source?.[field]) {
      fail(character, `glyph source is missing ${field}`);
    }
  }

  if (typeof character.glyph?.source?.modified !== "boolean") {
    fail(character, "glyph source modified flag must be boolean");
  }

  for (const source of character.sources ?? []) {
    try {
      new URL(source.href);
    } catch {
      fail(character, `source "${source.id}" has an invalid URL`);
    }
  }

  for (const component of character.components ?? []) {
    if (!component.roles?.length) {
      fail(character, `component "${component.id}" has no roles`);
    }

    const invalidRoles = (component.roles ?? []).filter((role) => !allowedRoles.has(role));
    if (invalidRoles.length > 0) {
      fail(character, `component "${component.id}" has invalid role(s): ${invalidRoles.join(", ")}`);
    }

    if (!component.sourceRefs?.length) {
      fail(character, `component "${component.id}" has no source references`);
    }

    const missingSourceRefs = (component.sourceRefs ?? []).filter((id) => !sourceIds.has(id));
    if (missingSourceRefs.length > 0) {
      fail(
        character,
        `component "${component.id}" has unknown source reference(s): ${missingSourceRefs.join(", ")}`
      );
    }
  }

  for (const related of character.related ?? []) {
    if (!related.href) continue;
    const match = related.href.match(/^\/characters\/([^/]+)\/$/);
    if (!match || !publishedSlugs.has(match[1])) {
      fail(character, `related link does not resolve to a published character: ${related.href}`);
    }
  }

  const svgPath = path.join(root, character.glyph.sourcePath);
  let svg = "";

  try {
    svg = readFileSync(svgPath, "utf8");
  } catch {
    fail(character, `missing SVG at ${character.glyph.sourcePath}`);
    continue;
  }

  if (character.glyph.source.repository === "Connum/HanziVG") {
    if (character.glyph.source.license !== "CC BY-SA 3.0") {
      fail(character, "HanziVG-derived glyph must retain the CC BY-SA 3.0 license");
    }

    if (!/^[a-f0-9]{40}$/.test(character.glyph.source.revision)) {
      fail(character, "HanziVG source revision must be a pinned commit SHA");
    }

    for (const attribution of [
      character.glyph.source.path,
      character.glyph.source.revision,
      "CC BY-SA 3.0"
    ]) {
      if (!svg.includes(attribution)) {
        fail(character, `SVG attribution is missing: ${attribution}`);
      }
    }
  }

  if (!svg.includes(`viewBox="${character.glyph.viewBox}"`)) {
    fail(character, `SVG viewBox must be "${character.glyph.viewBox}"`);
  }

  if (!/<title\b[^>]*>[\s\S]+?<\/title>/.test(svg)) {
    fail(character, "SVG is missing a title");
  }

  if (!/<desc\b[^>]*>[\s\S]+?<\/desc>/.test(svg)) {
    fail(character, "SVG is missing a description");
  }

  const expectedIds = character.components.map((component) => component.id).sort();
  const blocks = componentBlocks(svg);
  const actualIds = blocks.map((block) => block.id).sort();

  const missing = expectedIds.filter((id) => !actualIds.includes(id));
  const extra = actualIds.filter((id) => !expectedIds.includes(id));
  const duplicates = actualIds.filter((id, index) => actualIds.indexOf(id) !== index);

  if (missing.length > 0) {
    fail(character, `missing SVG component group(s): ${missing.join(", ")}`);
  }

  if (extra.length > 0) {
    fail(character, `unexpected SVG component group(s): ${extra.join(", ")}`);
  }

  if (duplicates.length > 0) {
    fail(character, `duplicate SVG component group(s): ${duplicates.join(", ")}`);
  }

  for (const block of blocks) {
    if (!/id="component-[^"]+"/.test(block.block)) {
      fail(character, `component "${block.id}" is missing a stable component-* id`);
    }

    if (!/tabindex="0"/.test(block.block)) {
      fail(character, `component "${block.id}" is missing keyboard focus`);
    }

    if (!/aria-label="[^"]+"/.test(block.block)) {
      fail(character, `component "${block.id}" is missing an accessible label`);
    }

    const coordinates = numericCoordinates(block.block);
    const outOfBounds = coordinates.filter((coordinate) => coordinate < -120 || coordinate > 1144);

    if (outOfBounds.length > 0) {
      fail(
        character,
        `component "${block.id}" has coordinates outside the tolerated viewBox bounds`
      );
    }
  }
}

if (failures.length > 0) {
  console.error("Glyph validation failed:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`Validated ${characters.length} character glyph asset(s).`);
