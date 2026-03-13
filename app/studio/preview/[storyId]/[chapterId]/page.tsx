"use client";

import { useStudioStore } from "@/lib/useStudioStore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Story, Chapter, DialogueNode, Character } from "@/types/story";
import { SceneNode, StudioCharacter, StudioChapter, StudioDraft } from "@/types/studio";
import VNMode from "../../../../../components/reader/VNMode";
import WebtoonReader from "@/components/reader/WebtoonReader";

// Map Studio Draft shape to Static Reader shape
function adaptDraftToStory(draft: StudioDraft, chapter: StudioChapter): { story: Story, chapter: Chapter } {
  // Convert characters
  const characters: Character[] = draft.characters.map(c => ({
    id: c.id,
    name: c.name,
    palette: c.id,
  }));

  // Convert Nodes to DialogueNodes
  const dialogueNodes: DialogueNode[] = chapter.nodes.map(n => {
    
    const mapped: DialogueNode = {
      id: n.id,
      type: n.type as any,
      text: n.text,
      speaker: n.speaker,
      background: n.background && !n.background.includes('/') 
        ? `${n.background}` // lazy mapping for demo
        : n.background || `cafe_night`, // Default
      cinematicImage: n.cinematicImage,
      webtoonPanel: n.webtoonPanel ? { type: "wide", caption: n.webtoonPanel.caption } : undefined
    };

    if (n.type === "choice" && n.choices) {
      mapped.choices = n.choices.map(c => ({
        id: c.id || c.text,
        text: c.text,
        next: c.next || ""
      }));
    }

    if (n.characters && n.characters.length > 0) {
      const charInfo = n.characters[0];
      const foundChar = characters.find(c => c.id === charInfo.characterId);
      if (foundChar) {
        mapped.characters = [{
          characterId: foundChar.id,
          expression: charInfo.expression as any,
          position: charInfo.position as any,
          highlighted: true
        }];
      }
    }

    return mapped;
  });

  const adaptedStory: Story = {
    id: draft.id,
    title: draft.title,
    author: draft.author || "Creator",
    coverImage: draft.coverImage || "",
    genre: ["Studio Preview"],
    tags: draft.tags || [],
    synopsis: draft.synopsis,
    characters: characters,
    chapters: [],
    isComplete: false
  };

  const adaptedChapter: Chapter = {
    id: chapter.id,
    number: chapter.number,
    readTimeMinutes: chapter.readTimeMinutes,
    isLocked: false,
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
  const [nodeIndex, setNodeIndex] = useState(0);

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

  const currentNode = mockChapter.nodes[nodeIndex];

  const goNext = () => {
    const nextNodeId = currentNode.next;
    if (nextNodeId === "chapter_end") {
      alert("Preview Chapter Complete");
      return;
    }
    if (nextNodeId) {
      const targetIndex = mockChapter.nodes.findIndex((n) => n.id === nextNodeId);
      if (targetIndex !== -1) {
        setNodeIndex(targetIndex);
        return;
      }
    }
    if (nodeIndex < mockChapter.nodes.length - 1) {
      setNodeIndex(nodeIndex + 1);
    } else {
      alert("Preview Chapter Complete");
    }
  };

  const handleChoice = (choice: any) => {
    if (choice.next === "chapter_end") {
      alert("Preview Chapter Complete");
      return;
    }
    const targetIdx = mockChapter.nodes.findIndex((n) => n.id === choice.next);
    if (targetIdx !== -1) setNodeIndex(targetIdx);
    else goNext();
  };

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

      <div className="relative flex-1 flex flex-col overflow-hidden">
        {viewMode === "vn" ? (
          <VNMode 
            story={mockStory} 
            currentNode={currentNode}
            onNext={goNext}
            onChoice={handleChoice}
          />
        ) : (
          <div className="flex-1 overflow-y-auto">
            <WebtoonReader 
              nodes={mockChapter.nodes} 
              currentNodeIndex={nodeIndex} 
              onScrollToChoice={() => {}} 
            />
            {currentNode?.type !== "choice" && currentNode?.type !== "panel" && (
              <button onClick={goNext} className="w-full py-4 flex items-center justify-center gap-2 mt-1" style={{ color: "#9f7aea" }}>
                <span className="text-sm">Tap to continue ↓</span>
              </button>
            )}
            {currentNode?.type === "panel" && (
              <button onClick={goNext} className="w-full py-3 flex items-center justify-center" style={{ color: "#9f7aea" }}>
                <span className="text-sm">Continue ↓</span>
              </button>
            )}
            {currentNode?.type === "choice" && currentNode.choices && (
              <div className="px-4 py-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-center mb-1 text-white">
                  {currentNode.text}
                </p>
                {currentNode.choices.map((choice) => (
                  <button key={choice.id} onClick={() => handleChoice(choice)}
                    className="w-full py-3.5 rounded-2xl text-sm font-medium bg-white text-black"
                  >
                    {choice.text}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
