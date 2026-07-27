import charactersRaw from "./characters.json";

export type CharacterStatus = "published" | "draft";
export type ReviewStatus = "pending" | "approved";
export type ComponentRole =
  | "semantic"
  | "phonetic"
  | "radical"
  | "visual"
  | "historical"
  | "uncertain";

export interface CharacterSource {
  id: string;
  title: string;
  href: string;
  note: string;
}

export interface CharacterComponent {
  id: string;
  form: string;
  roles: ComponentRole[];
  meaning: string;
  note: string;
  confidence: "high" | "medium" | "low";
  sourceRefs: string[];
  href?: string;
}

export interface CharacterExample {
  word: string;
  pinyin: string;
  gloss: string;
}

export interface RelatedCharacter {
  character: string;
  label: string;
  note: string;
  href?: string;
}

export interface CharacterEntry {
  slug: string;
  character: string;
  traditional?: string;
  pinyin: string;
  pinyinDisplay: string;
  coreMeaning: string;
  shortGloss: string;
  explanation: string;
  radical: string;
  strokeCount: number;
  frequencyBand: string;
  glyph: {
    sourcePath: string;
    viewBox: string;
    title: string;
    description: string;
    source: {
      repository: string;
      path: string;
      revision: string;
      license: string;
      modified: boolean;
    };
    review: {
      technical: ReviewStatus;
      visual: ReviewStatus;
      editorial: ReviewStatus;
    };
  };
  components: CharacterComponent[];
  examples: CharacterExample[];
  related: RelatedCharacter[];
  sources: CharacterSource[];
  status: CharacterStatus;
}

export const characters = charactersRaw as CharacterEntry[];

export const publishedCharacters = characters.filter(
  (character) => character.status === "published"
);

export function getCharacterBySlug(slug: string): CharacterEntry | undefined {
  return characters.find((character) => character.slug === slug);
}
