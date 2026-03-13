"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { STORIES, BACKGROUND_GRADIENTS } from "@/data/stories";
import { DialogueNode, HistoryEntry, Choice, CharacterOnStage } from "@/types/story";
import ReaderHeader from "@/components/reader/ReaderHeader";
import CharacterSprite from "@/components/reader/CharacterSprite";
import DialogueBox from "@/components/reader/DialogueBox";
import ChoiceModal from "@/components/reader/ChoiceModal";
import HistoryDrawer from "@/components/reader/HistoryDrawer";
import RewindModal from "@/components/reader/RewindModal";
import AudioPanel from "@/components/reader/AudioPanel";
import WebtoonReader from "@/components/reader/WebtoonReader";
import ChapterComplete from "@/components/reader/ChapterComplete";
import SceneBackground from "@/components/reader/SceneBackground";
import AmbientEffect from "@/components/reader/AmbientEffect";
import VNMode from "../../../../../components/reader/VNMode";
import { notFound } from "next/navigation";

interface PageParams {
  storyId: string;
  chapterId: string;
}

export default function ChapterPage({ params }: { params: Promise<PageParams> }) {
  const { storyId, chapterId } = use(params);
  const story = STORIES.find((s) => s.id === storyId);
  const chapter = story?.chapters.find((c) => c.id === chapterId);
  if (!story || !chapter) return notFound();
  const chapterIndex = story.chapters.indexOf(chapter);
  const nextChapter = story.chapters[chapterIndex + 1];
  return <ChapterReader story={story} chapter={chapter} nextChapter={nextChapter} />;
}

/* ─────────────────────────────────────── */
/*  Main reader                            */
/* ─────────────────────────────────────── */
function ChapterReader({
  story,
  chapter,
  nextChapter,
}: {
  story: (typeof STORIES)[0];
  chapter: (typeof STORIES)[0]["chapters"][0];
  nextChapter?: (typeof STORIES)[0]["chapters"][0];
}) {
  const [mode, setMode] = useState<"vn" | "webtoon">("vn");
  const [nodeIndex, setNodeIndex] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRewindOpen, setIsRewindOpen] = useState(false);
  const [rewindTarget, setRewindTarget] = useState<HistoryEntry | null>(null);
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [readStartTime] = useState(Date.now());
  const webtoonRef = useRef<HTMLDivElement>(null);

  const nodes = chapter.nodes;
  const currentNode = nodes[nodeIndex];

  // Track history
  useEffect(() => {
    if (!currentNode) return;
    if (currentNode.type === "choice") return;
    if (currentNode.id === "chapter_end") return;
    setHistory((prev) => {
      if (prev.length > 0 && prev[prev.length - 1].nodeId === currentNode.id) return prev;
      return [
        ...prev,
        {
          nodeId: currentNode.id,
          speaker: currentNode.speaker,
          text: currentNode.text,
          timestamp: Date.now(),
        },
      ];
    });
  }, [nodeIndex]);

  const goNext = useCallback(() => {
    if (!currentNode?.next) {
      setIsComplete(true);
      return;
    }
    const nextIdx = nodes.findIndex((n) => n.id === currentNode.next);
    if (nextIdx === -1) { setIsComplete(true); return; }
    setNodeIndex(nextIdx);
    if (mode === "webtoon") {
      setTimeout(() => webtoonRef.current?.scrollTo({ top: webtoonRef.current.scrollHeight, behavior: "smooth" }), 100);
    }
  }, [currentNode, nodes, mode]);

  const handleChoice = useCallback((choice: Choice) => {
    setHistory((prev) => [
      ...prev,
      { nodeId: currentNode.id, text: choice.text.replace(/^"|"$/g, ""), timestamp: Date.now(), isChoice: true },
    ]);
    const nextIdx = nodes.findIndex((n) => n.id === choice.next);
    if (nextIdx === -1) { setIsComplete(true); return; }
    setNodeIndex(nextIdx);
  }, [currentNode, nodes]);

  const handleRewindRequest = (entry: HistoryEntry) => {
    setRewindTarget(entry);
    setIsHistoryOpen(false);
    setIsRewindOpen(true);
  };

  const handleRewindConfirm = () => {
    if (!rewindTarget) { setIsRewindOpen(false); return; }
    const targetIdx = nodes.findIndex((n) => n.id === rewindTarget.nodeId);
    if (targetIdx !== -1) {
      setNodeIndex(targetIdx);
      const histIdx = history.findIndex((h) => h.nodeId === rewindTarget.nodeId);
      if (histIdx !== -1) setHistory((prev) => prev.slice(0, histIdx + 1));
    }
    setIsRewindOpen(false);
    setRewindTarget(null);
  };

  const readTimeMinutes = Math.max(1, Math.round((Date.now() - readStartTime) / 60000)) || chapter.readTimeMinutes;
  const bgKey = currentNode?.background || "rooftop_night";

  if (isComplete) {
    return (
      <div className="relative flex flex-col overflow-hidden" style={{ height: "100dvh", maxWidth: "430px", margin: "0 auto" }}>
        <ChapterComplete chapter={chapter} nextChapter={nextChapter} storyId={story.id} readTimeMinutes={readTimeMinutes} />
      </div>
    );
  }

  return (
    <div
      className="relative flex flex-col overflow-hidden select-none"
      style={{ height: "100dvh", maxWidth: "430px", margin: "0 auto" }}
    >
      {/* ── Background scene ── */}
      <AnimatePresence mode="wait">
        <motion.div key={bgKey} className="absolute inset-0" style={{ zIndex: 0 }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {mode === "vn" ? (
            <SceneBackground sceneKey={bgKey} />
          ) : (
            <div className="absolute inset-0" style={{ background: "#f8f5ff" }} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Ambient effect ── */}
      {mode === "vn" && <AmbientEffect effect={currentNode?.sceneEffect} />}

      {/* ── Vignette ── */}
      {mode === "vn" && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(0,0,0,0.45) 100%)",
            zIndex: 4,
          }}
        />
      )}

      {/* ── Header ── */}
      <div className="relative" style={{ zIndex: 10 }}>
        <ReaderHeader
          title={story.title}
          mode={mode}
          onModeToggle={() => setMode((m) => (m === "vn" ? "webtoon" : "vn"))}
          onHistoryOpen={() => setIsHistoryOpen(true)}
          onAudioOpen={() => setIsAudioOpen(true)}
          onRewindOpen={() => setIsRewindOpen(true)}
        />
        {/* Chapter strip */}
        <div
          className="px-5 py-1"
          style={{
            background: mode === "vn" ? "rgba(10,6,20,0.55)" : "rgba(248,245,255,0.85)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="text-xs" style={{ color: mode === "vn" ? "rgba(196,181,253,0.65)" : "#9f7aea" }}>
            Ch.{chapter.number} · {chapter.title}
          </span>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="relative flex-1 flex flex-col overflow-hidden" style={{ zIndex: 5 }}>
        {mode === "vn" ? (
          <VNMode
            currentNode={currentNode}
            story={story}
            onNext={goNext}
            onChoice={handleChoice}
          />
        ) : (
          <div ref={webtoonRef} className="flex-1 overflow-y-auto">
            <WebtoonReader nodes={nodes} currentNodeIndex={nodeIndex} onScrollToChoice={() => {}} />
            {currentNode?.type !== "choice" && currentNode?.type !== "panel" && (
              <button onClick={goNext} className="w-full py-4 flex items-center justify-center gap-2 mt-1" style={{ color: "#9f7aea" }}>
                <span className="text-sm">Tap to continue</span>
                <span>↓</span>
              </button>
            )}
            {currentNode?.type === "panel" && (
              <button onClick={goNext} className="w-full py-3 flex items-center justify-center" style={{ color: "#9f7aea" }}>
                <span className="text-sm">Continue ↓</span>
              </button>
            )}
            {currentNode?.type === "choice" && currentNode.choices && (
              <div className="px-4 py-4 flex flex-col gap-3">
                <p className="text-sm font-semibold text-center mb-1" style={{ color: "#2d1b4e", fontFamily: "'Georgia', serif" }}>
                  {currentNode.text}
                </p>
                {currentNode.choices.map((choice) => (
                  <motion.button key={choice.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => handleChoice(choice)}
                    className="w-full py-3.5 rounded-2xl text-sm font-medium"
                    style={{ background: "white", color: "#2d1b4e", border: "1px solid rgba(196,181,253,0.5)", fontStyle: "italic", fontFamily: "'Georgia', serif", boxShadow: "0 2px 12px rgba(124,58,237,0.1)" }}
                  >
                    {choice.text}
                  </motion.button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── VN Choice overlay ── */}
      {mode === "vn" && currentNode?.type === "choice" && currentNode.choices && (
        <div className="absolute inset-0" style={{ zIndex: 20 }}>
          <ChoiceModal isOpen prompt={currentNode.text} choices={currentNode.choices} onChoice={handleChoice} />
        </div>
      )}

      {/* ── Drawers / Modals ── */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 30 }}>
        <div className="pointer-events-auto">
          <HistoryDrawer isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onRewind={handleRewindRequest} />
          <RewindModal isOpen={isRewindOpen} onKeepReading={() => { setIsRewindOpen(false); setRewindTarget(null); }} onRewind={handleRewindConfirm} />
          <AudioPanel isOpen={isAudioOpen} onClose={() => setIsAudioOpen(false)} />
        </div>
      </div>
    </div>
  );
}
