export type StoryStatus = "draft" | "preview" | "published";
export type NodeMood = "neutral" | "happy" | "sad" | "surprised" | "flustered" | "shy" | "thinking";
export type Position = "left" | "center" | "right";
export type SceneEffect = "rain" | "snow" | "bokeh" | "particles" | "none";
export type NodeType = "narration" | "dialogue" | "panel" | "choice";

export interface StudioCharacter {
  id: string;
  name: string;
  role: string;
  defaultPosition: Position;
  // A map of expression name -> image url (e.g., 'neutral' -> 'assets/chars/aoi_n.png')
  expressions: Record<string, string>;
}

export interface ChoiceOption {
  id: string;
  text: string;
  label?: string; // Short UI text
  next: string; // Target Node ID
  relationshipEffect?: number;
}

export interface SceneNode {
  id: string;
  type: NodeType;
  text: string;
  background?: string;
  sceneEffect?: SceneEffect;
  speaker?: string;
  characterId?: string;
  
  // Characters currently on screen in this node
  characters?: Array<{
    characterId: string;
    expression: string;
    position: Position;
    highlighted?: boolean;
  }>;

  // Options for choices
  choices?: ChoiceOption[];

  // Image for webtoon panels/cinematics
  cinematicImage?: string;
  webtoonPanel?: {
    type: "close" | "half" | "wide";
    caption?: string;
  };
  
  next?: string; // The ID of the next node (if linear)
  isThought?: boolean; // For narration/dialogue italics
}

export interface StudioChapter {
  id: string;
  number: number;
  title: string;
  readTimeMinutes: number;
  status: StoryStatus;
  nodes: SceneNode[]; // An array of nodes, effectively a directed graph
}

export interface StudioDraft {
  id: string;
  title: string;
  author: string;
  genre: string[];
  tags: string[];
  synopsis: string;
  coverImage?: string;
  status: StoryStatus;
  createdAt: string;
  updatedAt: string;
  characters: StudioCharacter[];
  chapters: StudioChapter[];
}
