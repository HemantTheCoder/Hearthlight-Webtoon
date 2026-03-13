"use client";

import { useStudioStore } from "@/lib/useStudioStore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Story, Chapter, DialogueNode, CharacterExt } from "@/types/story";
import { SceneNode, StudioCharacter, StudioChapter, StudioDraft } from "@/types/studio";
import VNMode from "@/components/reader/VNMode";
import WebtoonReader from "@/components/reader/WebtoonReader";

// Map Studio Draft shape to Static Reader shape
function adaptDraftToStory(draft: StudioDraft, chapter: StudioChapter): { story: Story, chapter: Chapter } {
  // Convert characters
  const characters: CharacterExt[] = draft.characters.map(c => ({
    id: c.id,
    name: c.name,
    expressions: Object.entries(c.expressions).map(([mood, url]) => ({
      mood,
      imageUrl: url || "https://placehold.co/400x800/1a1a2e/8b5cf6?text=Missing+Sprite" // Fallback
    }))
  }));

  // Convert Nodes to DialogueNodes
  const dialogueNodes: DialogueNode[] = chapter.nodes.map(n => {
    
    const mapped: DialogueNode = {
      id: n.id,
      text: n.text,
      speaker: n.speaker,
      backgroundUrl: n.background && !n.background.includes('/') 
        ? `/assets/bg_${n.background}.png` // lazy mapping for demo
        : n.background || `/assets/bg_cafe_night.png`, // Default
      cinematicImage: n.cinematicImage,
    };

    if (n.type === "choice" && n.choices) {
      mapped.options = n.choices.map(c => ({
        text: c.text,
        nextId: c.next
      }));
    }

    if (n.characters && n.characters.length > 0) {
      const charInfo = n.characters[0];
      const foundChar = characters.find(c => c.id === charInfo.characterId);
      if (foundChar) {
        mapped.character = foundChar.name;
        mapped.expression = charInfo.expression;
      }
    }

    // Connect node sequence if not a choice
    if (n.type !== "choice") {
       // Our studio node array is mostly linear. 
       // The VN logic uses options if it ends, or automatically increments array index if we don't return early.
       // For this simple mock, we'll let VNMode array-sequence handle it unless there's an explicit Next ID via choices.
    }

    return mapped;
  });

  const adaptedStory: Story = {
    id: draft.id,
    title: draft.title,
    coverUrl: draft.coverImage || "",
    genre: "Studio Preview",
    synopsis: draft.synopsis,
    characters: characters,
    chapters: []
  };

  const adaptedChapter: Chapter = {
    id: chapter.id,
    title: chapter.title,
    nodes: dialogueNodes
  };

  return { story: adaptedStory, chapter: adaptedChapter };
}

export default function PreviewEngine() {
  const { storyId, chapterId } = useParams();
  const router = useRouter();
  const { drafts } = useStudioStore();
  
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"webtoon" | "vn">("vn");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const draft = drafts.find((d) => d.id === storyId);
  const chapter = draft?.chapters.find((c) => c.id === chapterId);

  if (!draft || !chapter) {
    return <div className="text-white p-10">Draft data lost. Please return to studio.</div>;
  }

  const { story: mockStory, chapter: mockChapter } = adaptDraftToStory(draft, chapter);

  // If node array is empty
  if (mockChapter.nodes.length === 0) {
     return (
       <div className="flex flex-col items-center justify-center p-20 text-white h-screen bg-[#0f0a1e]">
         <p>This chapter is empty. Nothing to preview.</p>
         <button onClick={() => router.back()} className="mt-4 px-4 py-2 bg-purple-600 rounded">Go Back</button>
       </div>
     );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Studio Preview Overlay Header */}
      <div className="absolute top-0 left-0 right-0 z-[60] p-4 flex justify-between items-center pointer-events-none">
        <button 
          onClick={() => router.back()}
          className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur px-4 py-2 rounded-full text-white/80 hover:text-white border border-white/10"
        >
          <ChevronLeft size={16} /> Exit Preview
        </button>

        <div className="pointer-events-auto flex bg-black/60 backdrop-blur rounded-full border border-white/10 p-1">
          <button 
            onClick={() => setViewMode("vn")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${viewMode === "vn" ? "bg-purple-600 text-white" : "text-white/50"}`}
          >
            Visual Novel
          </button>
          <button 
            onClick={() => setViewMode("webtoon")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${viewMode === "webtoon" ? "bg-purple-600 text-white" : "text-white/50"}`}
          >
            Webtoon
          </button>
        </div>
      </div>

      {viewMode === "vn" ? (
        <VNMode 
          story={mockStory} 
          chapter={mockChapter} 
          onComplete={() => alert("Preview Chapter Complete")} 
        />
      ) : (
        <WebtoonReader 
          story={mockStory} 
          chapter={mockChapter} 
          onComplete={() => alert("Preview Chapter Complete")} 
        />
      )}
    </div>
  );
}
