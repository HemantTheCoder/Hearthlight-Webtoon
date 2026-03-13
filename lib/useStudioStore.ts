import { create } from "zustand";
import { persist } from "zustand/middleware";
import { StudioDraft, StudioCharacter, StudioChapter, SceneNode } from "@/types/studio";
import { v4 as uuidv4 } from "uuid";

interface StudioState {
  drafts: StudioDraft[];
  activeDraftId: string | null;
  
  // Actions
  createDraft: (title: string) => string;
  deleteDraft: (id: string) => void;
  setActiveDraft: (id: string | null) => void;
  updateDraft: (id: string, updates: Partial<StudioDraft>) => void;
  
  // Character Actions
  addCharacter: (draftId: string, character: StudioCharacter) => void;
  updateCharacter: (draftId: string, characterId: string, updates: Partial<StudioCharacter>) => void;
  
  // Chapter Actions
  addChapter: (draftId: string, title: string) => string;
  updateChapter: (draftId: string, chapterId: string, updates: Partial<StudioChapter>) => void;
  
  // Node Actions
  addNode: (draftId: string, chapterId: string, node: SceneNode) => void;
  updateNode: (draftId: string, chapterId: string, nodeId: string, updates: Partial<SceneNode>) => void;
  deleteNode: (draftId: string, chapterId: string, nodeId: string) => void;
}

export const useStudioStore = create<StudioState>()(
  persist(
    (set) => ({
      drafts: [],
      activeDraftId: null,

      createDraft: (title) => {
        const newDraft: StudioDraft = {
          id: uuidv4(),
          title,
          author: "Creator", // Could tie to AuthContext later if needed
          genre: [],
          tags: [],
          synopsis: "",
          status: "draft",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          characters: [],
          chapters: [],
        };
        set((state) => ({ drafts: [...state.drafts, newDraft], activeDraftId: newDraft.id }));
        return newDraft.id;
      },

      deleteDraft: (id) =>
        set((state) => ({
          drafts: state.drafts.filter((d) => d.id !== id),
          activeDraftId: state.activeDraftId === id ? null : state.activeDraftId,
        })),

      setActiveDraft: (id) => set({ activeDraftId: id }),

      updateDraft: (id, updates) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
          ),
        })),

      addCharacter: (draftId, character) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? { ...d, characters: [...d.characters, character], updatedAt: new Date().toISOString() }
              : d
          ),
        })),

      updateCharacter: (draftId, characterId, updates) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  characters: d.characters.map((c) => (c.id === characterId ? { ...c, ...updates } : c)),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        })),

      addChapter: (draftId, title) => {
        const newChapter: StudioChapter = {
          id: uuidv4(),
          number: 1, // Will be computed or updated later
          title,
          readTimeMinutes: 5,
          status: "draft",
          nodes: [],
        };
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  chapters: [...d.chapters, { ...newChapter, number: d.chapters.length + 1 }],
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        }));
        return newChapter.id;
      },

      updateChapter: (draftId, chapterId, updates) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  chapters: d.chapters.map((ch) => (ch.id === chapterId ? { ...ch, ...updates } : ch)),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        })),

      addNode: (draftId, chapterId, node) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  chapters: d.chapters.map((ch) =>
                    ch.id === chapterId ? { ...ch, nodes: [...ch.nodes, node] } : ch
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        })),

      updateNode: (draftId, chapterId, nodeId, updates) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  chapters: d.chapters.map((ch) =>
                    ch.id === chapterId
                      ? {
                          ...ch,
                          nodes: ch.nodes.map((n) => (n.id === nodeId ? { ...n, ...updates } : n)),
                        }
                      : ch
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        })),

      deleteNode: (draftId, chapterId, nodeId) =>
        set((state) => ({
          drafts: state.drafts.map((d) =>
            d.id === draftId
              ? {
                  ...d,
                  chapters: d.chapters.map((ch) =>
                    ch.id === chapterId
                      ? {
                          ...ch,
                          nodes: ch.nodes.filter((n) => n.id !== nodeId),
                        }
                      : ch
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : d
          ),
        })),
    }),
    {
      name: "hearthlight-studio-storage",
    }
  )
);
