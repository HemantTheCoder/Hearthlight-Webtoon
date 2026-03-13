"use client";

import { motion } from "framer-motion";
import { Clock, Heart, MessageCircle, ChevronRight, Home, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Chapter } from "@/types/story";

interface ChapterCompleteProps {
  chapter: Chapter;
  nextChapter?: Chapter;
  storyId: string;
  readTimeMinutes: number;
}

export default function ChapterComplete({ chapter, nextChapter, storyId, readTimeMinutes }: ChapterCompleteProps) {
  const router = useRouter();

  const getDaysUntilUnlock = (unlockDate?: string) => {
    if (!unlockDate) return null;
    const diff = new Date(unlockDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? days : 0;
  };

  const daysUntil = nextChapter?.isLocked ? getDaysUntilUnlock(nextChapter.unlockDate) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center"
      style={{
        background: "linear-gradient(160deg, #4c1d95 0%, #7c3aed 40%, #a855f7 70%, #c084fc 100%)",
        minHeight: "100%",
      }}
    >
      {/* Stars decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${5 + Math.random() * 40}%`,
              width: Math.random() > 0.5 ? "3px" : "2px",
              height: Math.random() > 0.5 ? "3px" : "2px",
              borderRadius: "50%",
              background: "rgba(255,255,255,0.6)",
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Chapter complete card */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full max-w-xs"
      >
        <div
          className="rounded-3xl p-6 mb-4"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mb-4"
          >
            ✨
          </motion.div>

          <h1
            className="text-2xl font-bold text-white mb-1"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Chapter Complete
          </h1>

          <div className="flex items-center justify-center gap-1.5 mb-6">
            <Clock size={13} style={{ color: "rgba(255,255,255,0.7)" }} />
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
              Read in {readTimeMinutes} mins
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold"
              style={{
                background: "linear-gradient(135deg, #f472b6, #fb7185)",
                color: "white",
                boxShadow: "0 4px 20px rgba(244,114,182,0.4)",
              }}
            >
              <Heart size={16} fill="white" />
              Like Chapter
            </motion.button>

            <button
              className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-medium"
              style={{
                background: "rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <MessageCircle size={15} />
              Leave a Comment
            </button>

            {nextChapter && !nextChapter.isLocked ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/story/${storyId}/chapter/${nextChapter.id}`)}
                className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-semibold"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  color: "#7c3aed",
                }}
              >
                Next Chapter
                <ChevronRight size={16} />
              </motion.button>
            ) : nextChapter?.isLocked ? (
              <LockedNextChapter daysUntil={daysUntil} storyId={storyId} />
            ) : null}
          </div>
        </div>

        <button
          onClick={() => router.push("/")}
          className="flex items-center justify-center gap-2 text-sm"
          style={{ color: "rgba(255,255,255,0.7)" }}
        >
          <Home size={14} />
          Back to Library
        </button>
      </motion.div>
    </motion.div>
  );
}

function LockedNextChapter({ daysUntil, storyId }: { daysUntil: number | null; storyId: string }) {
  const router = useRouter();

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <Lock size={20} className="mx-auto mb-2" style={{ color: "rgba(255,255,255,0.6)" }} />
      <p className="text-sm font-semibold text-white mb-1">Coming Soon</p>
      <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.6)" }}>
        The next chapter is being polished with love.
      </p>
      {daysUntil !== null && (
        <>
          <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
            UNLOCKS IN
          </p>
          <p className="text-lg font-bold text-white mb-3">
            {daysUntil} {daysUntil === 1 ? "Day" : "Days"}
          </p>
        </>
      )}
      <button
        onClick={() => router.push("/")}
        className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5"
        style={{
          background: "rgba(255,255,255,0.12)",
          color: "rgba(255,255,255,0.85)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Home size={13} />
        Back to Library
      </button>
    </div>
  );
}
