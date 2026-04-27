import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const charactersPath = path.join(root, "src", "data", "characters.json");
const characters = JSON.parse(readFileSync(charactersPath, "utf8"));
const failures = [];

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

for (const character of characters) {
  const svgPath = path.join(root, character.glyph.sourcePath);
  let svg = "";

  try {
    svg = readFileSync(svgPath, "utf8");
  } catch {
    fail(character, `missing SVG at ${character.glyph.sourcePath}`);
    continue;
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
    if (!/id="component-[^"]+"/.test(block)) {
      fail(character, `component "${block.id}" is missing a stable component-* id`);
    }

    if (!/tabindex="0"/.test(block)) {
      fail(character, `component "${block.id}" is missing keyboard focus`);
    }

    if (!/aria-label="[^"]+"/.test(block)) {
      fail(character, `component "${block.id}" is missing an accessible label`);
    }

    const coordinates = numericCoordinates(block);
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
