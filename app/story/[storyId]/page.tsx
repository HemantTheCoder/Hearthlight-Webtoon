"use client";

import { use } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Lock, ChevronRight, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { STORIES } from "@/data/stories";
import { notFound } from "next/navigation";

const PALETTE_COLORS: Record<string, string> = {
  eleanor: "#e8a598",
  aoi: "#a8c4e8",
  hana: "#f4a8c4",
  player: "#c4b5fd",
};

const COVER_GRADIENTS = [
  "linear-gradient(160deg, #1a1033 0%, #4c1d95 50%, #7c3aed 100%)",
  "linear-gradient(160deg, #1e1038 0%, #be185d 50%, #f472b6 100%)",
  "linear-gradient(160deg, #0f172a 0%, #1e40af 50%, #60a5fa 100%)",
];

export default function StoryPage({ params }: { params: Promise<{ storyId: string }> }) {
  const { storyId } = use(params);
  const router = useRouter();
  const story = STORIES.find((s) => s.id === storyId);
  if (!story) return notFound();

  const gradIndex = STORIES.indexOf(story) % COVER_GRADIENTS.length;
  const gradient = COVER_GRADIENTS[gradIndex];
  const firstUnlockedChapter = story.chapters.find((c) => !c.isLocked);

  const getDaysUntil = (unlockDate?: string) => {
    if (!unlockDate) return null;
    const diff = new Date(unlockDate).getTime() - Date.now();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div
      className="flex flex-col"
      style={{
        background: "#0f0a1e",
        maxWidth: "430px",
        margin: "0 auto",
        minHeight: "100dvh",
      }}
    >
      {/* Hero cover */}
      <div className="relative" style={{ height: "320px" }}>
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            priority
            className="object-cover object-top"
            style={{ filter: "brightness(0.75)" }}
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: gradient }} />

            {/* Decorative character */}
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              style={{ width: "160px", height: "240px" }}
            >
              <div
                className="w-full h-full"
                style={{
                  borderRadius: "50% 50% 0 0",
                  background: "rgba(244,228,216,0.3)",
                }}
              />
              <div
                className="absolute"
                style={{
                  top: "10%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "72px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(244,228,216,0.4)",
                }}
              />
            </div>
          </>
        )}

        {/* Gradient fade to bg */}
        <div
          className="absolute bottom-0 left-0 right-0"
          style={{
            height: "120px",
            background: "linear-gradient(0deg, #0f0a1e 0%, transparent 100%)",
          }}
        />

        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-12 left-4 w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: "rgba(15,10,30,0.6)", backdropFilter: "blur(8px)" }}
        >
          <ArrowLeft size={18} style={{ color: "rgba(255,255,255,0.9)" }} />
        </button>

        {/* Badges */}
        <div className="absolute top-12 right-4 flex flex-col gap-2 items-end">
          {story.isNew && (
            <span
              className="text-xs px-2.5 py-1 rounded-full font-semibold"
              style={{ background: "rgba(244,114,182,0.3)", color: "#fda4af", backdropFilter: "blur(8px)" }}
            >
              NEW
            </span>
          )}
          {story.isComplete && (
            <span
              className="text-xs px-2.5 py-1 rounded-full"
              style={{ background: "rgba(167,139,250,0.3)", color: "#c4b5fd", backdropFilter: "blur(8px)" }}
            >
              COMPLETE
            </span>
          )}
        </div>
      </div>

      {/* Story info */}
      <div className="px-5 -mt-4 relative z-10">
        <h1
          className="text-2xl font-bold text-white mb-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {story.title}
        </h1>
        <p className="text-sm mb-3" style={{ color: "rgba(196,181,253,0.7)" }}>
          by {story.author}
        </p>

        {/* Genres */}
        <div className="flex flex-wrap gap-2 mb-4">
          {story.genre.map((g) => (
            <span
              key={g}
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "rgba(196,181,253,0.1)", color: "rgba(196,181,253,0.8)", border: "1px solid rgba(196,181,253,0.2)" }}
            >
              {g}
            </span>
          ))}
          {story.tags.slice(0, 2).map((t) => (
            <span
              key={t}
              className="text-xs px-3 py-1 rounded-full"
              style={{ background: "rgba(244,114,182,0.08)", color: "rgba(244,114,182,0.7)", border: "1px solid rgba(244,114,182,0.15)" }}
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Synopsis */}
        <p
          className="text-sm leading-relaxed mb-6"
          style={{ color: "rgba(255,255,255,0.7)", fontStyle: "italic", fontFamily: "'Georgia', serif" }}
        >
          {story.synopsis}
        </p>

        {/* Start reading button */}
        {firstUnlockedChapter && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => router.push(`/story/${story.id}/chapter/${firstUnlockedChapter.id}`)}
            className="w-full py-4 rounded-2xl font-semibold text-white flex items-center justify-center gap-2 mb-6"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #a855f7)",
              boxShadow: "0 8px 24px rgba(124,58,237,0.35)",
            }}
          >
            <BookOpen size={18} />
            Start Reading
          </motion.button>
        )}

        {/* Characters */}
        {story.characters.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-sm font-semibold mb-3"
              style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Georgia', serif" }}
            >
              Characters
            </h2>
            <div className="flex gap-3">
              {story.characters.filter((c) => c.id !== "player").map((char) => (
                <div key={char.id} className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    style={{
                      background: `radial-gradient(circle, ${PALETTE_COLORS[char.palette] ?? "#c4b5fd"}, ${(PALETTE_COLORS[char.palette] ?? "#c4b5fd") + "80"})`,
                      border: "2px solid rgba(255,255,255,0.15)",
                    }}
                  />
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                      {char.name}
                    </p>
                    {char.description && (
                      <p className="text-xs line-clamp-1" style={{ color: "rgba(196,181,253,0.6)", fontSize: "10px" }}>
                        {char.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chapters list */}
        <div className="mb-8">
          <h2
            className="text-sm font-semibold mb-3"
            style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Georgia', serif" }}
          >
            Chapters
          </h2>
          <div className="flex flex-col gap-2">
            {story.chapters.map((chapter) => {
              const daysUntil = chapter.isLocked ? getDaysUntil(chapter.unlockDate) : null;
              return (
                <motion.button
                  key={chapter.id}
                  whileHover={!chapter.isLocked ? { scale: 1.01 } : {}}
                  whileTap={!chapter.isLocked ? { scale: 0.99 } : {}}
                  onClick={() => {
                    if (!chapter.isLocked) {
                      router.push(`/story/${story.id}/chapter/${chapter.id}`);
                    }
                  }}
                  disabled={chapter.isLocked}
                  className="flex items-center gap-4 rounded-2xl px-4 py-3 text-left"
                  style={{
                    background: chapter.isLocked
                      ? "rgba(255,255,255,0.04)"
                      : "rgba(196,181,253,0.08)",
                    border: chapter.isLocked
                      ? "1px solid rgba(255,255,255,0.06)"
                      : "1px solid rgba(196,181,253,0.15)",
                    opacity: chapter.isLocked ? 0.7 : 1,
                  }}
                >
                  {/* Chapter number */}
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{
                      background: chapter.isLocked
                        ? "rgba(255,255,255,0.06)"
                        : "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(168,85,247,0.4))",
                    }}
                  >
                    {chapter.isLocked ? (
                      <Lock size={14} style={{ color: "rgba(255,255,255,0.4)" }} />
                    ) : (
                      <span className="text-xs font-bold" style={{ color: "#c4b5fd" }}>
                        {chapter.number}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium"
                      style={{ color: chapter.isLocked ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.85)" }}
                    >
                      {chapter.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {!chapter.isLocked && (
                        <div className="flex items-center gap-1">
                          <Clock size={10} style={{ color: "rgba(196,181,253,0.5)" }} />
                          <span style={{ fontSize: "11px", color: "rgba(196,181,253,0.5)" }}>
                            {chapter.readTimeMinutes} min
                          </span>
                        </div>
                      )}
                      {chapter.isLocked && daysUntil !== null && (
                        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>
                          Unlocks in {daysUntil}d
                        </span>
                      )}
                    </div>
                  </div>

                  {!chapter.isLocked && (
                    <ChevronRight size={14} style={{ color: "rgba(196,181,253,0.4)" }} />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
