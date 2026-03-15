"use client";

import { motion } from "framer-motion";
import { Heart, Share2, ChevronRight, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface WebtoonFooterProps {
  storyId: string;
  nextChapterId?: string;
}

export default function WebtoonFooter({ storyId, nextChapterId }: WebtoonFooterProps) {
  const router = useRouter();

  return (
    <div className="px-5 py-20 flex flex-col items-center">
      <div className="flex flex-col items-center gap-8 mb-16 w-full max-w-[280px]">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border border-white/10"
          style={{ background: "linear-gradient(180deg, rgba(124, 58, 237, 0.2), transparent)" }}
        >
          <div className="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.4)]">
            <Heart size={32} fill="white" className="text-white" />
          </div>
          <p className="text-sm font-bold text-white uppercase tracking-widest">Love This Story</p>
          <p className="text-[10px] text-white/40">12.5k supporters</p>
        </motion.button>

        <div className="flex gap-4 w-full">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex-1 py-4 rounded-3xl border border-white/5 bg-white/5 flex items-center justify-center gap-2 text-xs font-semibold text-white/70"
          >
            <Share2 size={14} />
            Share
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="flex-1 py-4 rounded-3xl border border-white/5 bg-white/5 flex items-center justify-center gap-2 text-xs font-semibold text-white/70"
          >
            <MessageCircle size={14} />
            Discuss
          </motion.button>
        </div>
      </div>

      {nextChapterId ? (
        <motion.button
          onClick={() => router.push(`/story/${storyId}/chapter/${nextChapterId}`)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-6 rounded-3xl flex items-center justify-between px-8 group overflow-hidden relative"
          style={{ background: "white" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity" />
          <div className="text-left">
            <p className="text-[10px] font-bold text-purple-600 uppercase tracking-tighter mb-0.5">Up Next</p>
            <p className="text-lg font-bold text-black" style={{ fontFamily: "'Georgia', serif" }}>Next Episode</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
            <ChevronRight size={20} />
          </div>
        </motion.button>
      ) : (
        <div className="text-center">
            <p className="text-white/30 text-xs italic">You've reached the end of the available episodes.</p>
        </div>
      )}
      
      <p className="mt-12 text-[10px] text-white/20 uppercase tracking-[0.4em]">Hearthlight Studios</p>
    </div>
  );
}
