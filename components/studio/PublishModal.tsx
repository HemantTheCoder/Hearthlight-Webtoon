import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useStudioStore } from "@/lib/useStudioStore";
import { StudioDraft } from "@/types/studio";
import { X, Globe2, AlertTriangle, CheckCircle2 } from "lucide-react";

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: StudioDraft;
}

export default function PublishModal({ isOpen, onClose, draft }: PublishModalProps) {
  const { updateDraft } = useStudioStore();
  const [agreed, setAgreed] = useState(false);
  const [rating, setRating] = useState("T");

  const canPublish = draft.coverImage && draft.chapters.length > 0;

  const handlePublish = () => {
    if (!agreed || !canPublish) return;
    
    updateDraft(draft.id, {
      status: "published",
    });
    
    onClose();
    // Simulate toast
    alert(`🎉 "${draft.title}" has been published to the Community!`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-[#140b2e] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
                <Globe2 size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif">Publish Story</h2>
                <p className="text-sm text-purple-200/60">Push your creation to the Hearthlight community.</p>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6">
              <h3 className="font-bold mb-1 truncate">{draft.title}</h3>
              <p className="text-xs text-white/50">{draft.chapters.length} Chapters • {draft.characters.length} Characters</p>
            </div>

            {!canPublish ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm mb-6">
                <AlertTriangle size={18} className="shrink-0 mt-0.5" />
                <p>You cannot publish this draft yet. Ensure you have set a <strong>Cover Image</strong> in Story Settings and have created at least one <strong>Chapter</strong>.</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-2 mb-6">
                  <label className="text-sm text-purple-200/60 font-medium">Content Rating</label>
                  <select 
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="bg-black/20 border border-white/10 rounded-xl px-4 py-3 outline-none text-white/90 focus:border-purple-500/50"
                  >
                    <option value="E">Everyone (Safe, wholesame romance)</option>
                    <option value="T">Teen (Mild language, suggestive themes)</option>
                    <option value="M">Mature (Dark themes, strong language)</option>
                  </select>
                </div>

                <div className="flex items-start gap-3 mb-8">
                   <input 
                     type="checkbox" 
                     id="agree"
                     checked={agreed}
                     onChange={(e) => setAgreed(e.target.checked)}
                     className="mt-1 shrink-0 accent-purple-500"
                   />
                   <label htmlFor="agree" className="text-xs text-white/60 leading-relaxed cursor-pointer">
                     I confirm that this story follows the Hearthlight Community Guidelines, contains no graphic non-consensual content, and includes appropriate trigger warnings in the description if necessary.
                   </label>
                </div>
              </>
            )}

             <button
                onClick={handlePublish}
                disabled={!canPublish || !agreed}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: canPublish && agreed ? "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)" : "rgba(255,255,255,0.05)",
                  color: canPublish && agreed ? "white" : "rgba(255,255,255,0.3)",
                  boxShadow: canPublish && agreed ? "0 8px 25px rgba(168, 85, 247, 0.25)" : "none",
                }}
              >
                {canPublish && agreed && <CheckCircle2 size={18} />}
                Publish to Community
             </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
