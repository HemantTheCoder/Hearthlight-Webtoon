"use client";

import { useStudioStore } from "@/lib/useStudioStore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Settings, Users, BookOpen, ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import StorySettings from "@/components/studio/StorySettings";
import CharacterManager from "@/components/studio/CharacterManager";
import ChapterManager from "@/components/studio/ChapterManager";
import PublishModal from "@/components/studio/PublishModal";

type Tab = "settings" | "characters" | "chapters";

export default function StoryDraftOverview() {
  const { storyId } = useParams();
  const router = useRouter();
  const { drafts, updateDraft } = useStudioStore();
  const [activeTab, setActiveTab] = useState<Tab>("chapters");
  const [mounted, setMounted] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const draft = drafts.find((d) => d.id === storyId);

  if (!draft) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <h2 className="text-xl text-white/50 mb-4">Story draft not found</h2>
        <button onClick={() => router.push("/studio")} className="text-purple-400 hover:underline">
          Return to Dashboard
        </button>
      </div>
    );
  }

  const TABS = [
    { id: "chapters", label: "Chapters", icon: BookOpen },
    { id: "characters", label: "Characters", icon: Users },
    { id: "settings", label: "Story Info", icon: Settings },
  ] as const;

  return (
    <div className="w-full flex gap-8">
      {/* Sidebar / Setup Nav */}
      <aside className="w-64 shrink-0 flex flex-col gap-6">
        <Link
          href="/studio"
          className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
        >
          <ChevronLeft size={16} /> Dashboard
        </Link>
        
        <div>
          <h1 className="text-2xl font-bold mb-1 truncate" style={{ fontFamily: "'Georgia', serif" }}>
            {draft.title}
          </h1>
          <p className="text-xs text-purple-300/50 uppercase tracking-widest font-semibold">
            {draft.status} Draft
          </p>
        </div>

        <nav className="flex flex-col gap-2 mt-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-lg shadow-purple-900/10"
                    : "text-white/60 hover:bg-white/5 border border-transparent"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </nav>

        {/* Action Area */}
        <div className="mt-auto pt-8 border-t border-white/10">
           {draft.status === "published" ? (
             <div className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20">
               Live on Discovery
             </div>
           ) : (
             <>
               <button
                onClick={() => setIsPublishModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-transform hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
                  boxShadow: "0 8px 25px rgba(168, 85, 247, 0.25)",
                }}
               >
                 Publish Story...
               </button>
               <p className="text-[10px] text-center text-white/40 mt-3 leading-relaxed">Publishing requires at least 1 completed chapter and a cover image.</p>
             </>
           )}
        </div>
      </aside>

      <PublishModal 
        isOpen={isPublishModalOpen} 
        onClose={() => setIsPublishModalOpen(false)} 
        draft={draft} 
      />

      {/* Main Work Area */}
      <main className="flex-1 min-h-[600px] rounded-[32px] overflow-hidden relative" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(196,181,253,0.1)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 p-8 overflow-y-auto"
          >
            {activeTab === "settings" && <StorySettings draft={draft} />}
            {activeTab === "characters" && <CharacterManager draft={draft} />}
            {activeTab === "chapters" && <ChapterManager draft={draft} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
