export type ReadingMode = "vn" | "webtoon";

export type CharacterExpression =
  | "neutral"
  | "happy"
  | "shy"
  | "surprised"
  | "sad"
  | "thinking"
  | "flustered"
  | "excited";

export type CharacterPosition = "left" | "center" | "right";

export type SceneEffect = "rain" | "snow" | "bokeh" | "particles" | "none" | "flash" | "bloom" | "shake";

export interface CharacterOnStage {
  characterId: string;       // e.g. "eleanor"
  expression: CharacterExpression;
  position: CharacterPosition;
  highlighted?: boolean;      // dimmed if false, bright if true (default true)
}

export interface Choice {
  id: string;
  text: string;
  next: string;
  relationshipEffect?: number; // -2 to +2
  label?: string;              // e.g. "Tell the truth"
}

export interface WebtoonPanel {
  type: "wide" | "half" | "close" | "full";
  caption?: string;
  mood?: string;
  // For future: imagePath string once real art is added
}

export interface DialogueNode {
  id: string;
  type: "dialogue" | "narration" | "choice" | "panel" | "transition";

  // Dialogue content
  speaker?: string;           // displayed name
  characterId?: string;       // links to CharacterOnStage
  text: string;

  // Stage composition
  background?: string;        // scene key
  characters?: CharacterOnStage[];
  sceneEffect?: SceneEffect;

  // Navigation
  next?: string;
  choices?: Choice[];

  // Webtoon panel data
  webtoonPanel?: WebtoonPanel;

  // Dialogue style
  isThought?: boolean;        // italics bubble

  // Cinematic overrides
  cinematicImage?: string;    // e.g., 'coffee', 'eye', 'crane'
  audio?: string;             // one-off sfx key
  bgm?: string;               // background music key for this scene
  backgroundParallax?: number; // scroll speed multiplier for BG
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  coverImage?: string;
  readTimeMinutes: number;
  isLocked: boolean;
  unlockDate?: string;
  nodes: DialogueNode[];
}

export interface Story {
  id: string;
  title: string;
  author: string;
  genre: string[];
  tags: string[];
  synopsis: string;
  coverImage?: string;
  isComplete: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  isComingSoon?: boolean;
  chapters: Chapter[];
  characters: Character[];
}

export interface Character {
  id: string;
  name: string;
  description?: string;
  palette: string;   // color key for sprite renderer
}

export interface HistoryEntry {
  nodeId: string;
  speaker?: string;
  text: string;
  timestamp: number;
  isChoice?: boolean;
}

export interface ReadProgress {
  storyId: string;
  chapterId: string;
  nodeId: string;
  history: HistoryEntry[];
  relationshipScore: number;
  completedChapters: string[];
  choiceMap: Record<string, string>;
}
