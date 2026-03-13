"use client";

import { useStudioStore } from "@/lib/useStudioStore";
import { Plus, Book, Trash2, Edit3, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

export default function StudioDashboard() {
  const { drafts, createDraft, deleteDraft } = useStudioStore();
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newId = createDraft(newTitle);
    router.push(`/studio/story/${newId}`);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Georgia', serif" }}>
            My Projects
          </h2>
          <p className="text-sm" style={{ color: "rgba(196,181,253,0.6)" }}>
            Manage your visual novels, drafts, and published webtoons.
          </p>
        </div>
        
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
              color: "white",
              boxShadow: "0 8px 25px rgba(168, 85, 247, 0.25)",
            }}
          >
            <Plus size={18} />
            Create New Story
          </button>
        )}
      </div>

      {isCreating && (
        <motion.form 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleCreate}
          className="flex items-center gap-3 mb-10 p-4 rounded-2xl"
          style={{ background: "rgba(196,181,253,0.05)", border: "1px solid rgba(196,181,253,0.1)" }}
        >
          <input
            type="text"
            placeholder="Enter story title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-lg placeholder-white/30"
          />
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 text-sm text-white/50 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-500 transition-colors"
          >
            Create
          </button>
        </motion.form>
      )}

      {drafts.length === 0 && !isCreating ? (
        <div 
          className="w-full py-20 flex flex-col items-center justify-center rounded-3xl border border-dashed"
          style={{ borderColor: "rgba(196,181,253,0.2)", background: "rgba(0,0,0,0.2)" }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
            <Book size={32} style={{ color: "rgba(196,181,253,0.4)" }} />
          </div>
          <h3 className="text-xl font-medium mb-2 text-white/80">Your desk is empty</h3>
          <p className="text-sm text-white/40 text-center max-w-sm">
            You haven't created any stories yet. Start a new draft to begin building your visual novel.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drafts.map((draft) => (
            <motion.div
              layout
              key={draft.id}
              className="relative group rounded-3xl overflow-hidden cursor-pointer"
              style={{
                background: "rgba(20, 15, 35, 0.6)",
                border: "1px solid rgba(196,181,253,0.1)",
              }}
              onClick={() => router.push(`/studio/story/${draft.id}`)}
              whileHover={{ y: -4, borderColor: "rgba(168, 85, 247, 0.4)" }}
            >
              <div 
                className="aspect-video w-full flex items-center justify-center bg-black/40 relative overflow-hidden"
              >
                {draft.coverImage ? (
                   <img src={draft.coverImage} alt="Cover" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <ImageIcon size={32} style={{ color: "rgba(196,181,253,0.2)" }} />
                )}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 backdrop-blur-md">
                  {draft.status.toUpperCase()}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold mb-1 truncate">{draft.title}</h3>
                <p className="text-xs mb-4 truncate text-purple-300/50">
                  Last updated {new Date(draft.updatedAt).toLocaleDateString()}
                </p>

                <div className="flex items-center justify-between mt-4">
                  <div className="text-xs flex items-center gap-4 text-white/40">
                    <span>{draft.chapters.length} Chapters</span>
                    <span>{draft.characters.length} Characters</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm("Are you sure you want to delete this story? This cannot be undone.")) {
                        deleteDraft(draft.id);
                      }
                    }}
                    className="p-2 rounded-full hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
