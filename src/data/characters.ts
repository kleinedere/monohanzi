import charactersRaw from "./characters.json";

export type CharacterStatus = "published" | "draft";

export interface CharacterComponent {
  id: string;
  form: string;
  role: string;
  meaning: string;
  note: string;
  confidence: "high" | "medium" | "low";
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
  };
  components: CharacterComponent[];
  examples: CharacterExample[];
  related: RelatedCharacter[];
  status: CharacterStatus;
}

export const characters = charactersRaw as CharacterEntry[];

export function getCharacterBySlug(slug: string): CharacterEntry | undefined {
  return characters.find((character) => character.slug === slug);
}
