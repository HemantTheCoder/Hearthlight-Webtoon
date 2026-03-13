"use client";

import { useStudioStore } from "@/lib/useStudioStore";
import { useParams, useRouter } from "next/navigation";
import { ChevronLeft, Play, LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
// We'll extract the node editor list into a component to keep this file clean
import NodeEditorList from "@/components/studio/NodeEditorList";
import NodeMap from "@/components/studio/NodeMap";
import { ReactFlowProvider } from "@xyflow/react";

export default function ChapterBuilder() {
  const { storyId, chapterId } = useParams();
  const router = useRouter();
  const { drafts, updateChapter } = useStudioStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const draft = drafts.find((d) => d.id === storyId);
  const chapter = draft?.chapters.find((c) => c.id === chapterId);

  if (!draft || !chapter) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl text-white/50 mb-4">Chapter not found</h2>
        <button onClick={() => router.push(`/studio/story/${storyId}`)} className="text-purple-400 hover:underline">
          Return to Story
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f0a1e] text-white rounded-[32px] overflow-hidden border border-white/10 shadow-2xl">
      {/* Chapter Builder Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-black/40 border-b border-white/10">
        <div className="flex items-center gap-4">
          <Link
            href={`/studio/story/${storyId}`}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-lg font-bold font-serif">{chapter.title}</h1>
            <p className="text-xs text-purple-300/50">Chapter {chapter.number} • {draft.title}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push(`/studio/preview/${storyId}/${chapterId}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors"
          >
            <Play size={16} className="text-green-400" />
            Preview Scene
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Pane - Node Linear Editor */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <NodeEditorList draft={draft} chapter={chapter} />
        </div>

        {/* Right Pane - Visual Node Map (Branching Logic) */}
        <aside className="w-[400px] border-l border-white/10 bg-black/20 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-semibold text-sm flex items-center gap-2 text-white/80">
              <LayoutGrid size={16} /> Branching Flow Map
            </h2>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">BETA</span>
          </div>
          <div className="flex-1 w-full h-full relative" style={{ minHeight: "300px" }}>
            <ReactFlowProvider>
              <NodeMap chapter={chapter} />
            </ReactFlowProvider>
          </div>
        </aside>
      </main>
    </div>
  );
}
