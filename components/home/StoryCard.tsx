"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Story } from "@/types/story";
import { BookOpen, Star } from "lucide-react";

const COVER_GRADIENTS = [
  "linear-gradient(160deg, #1a1033 0%, #4c1d95 50%, #7c3aed 100%)",
  "linear-gradient(160deg, #1e1038 0%, #be185d 50%, #f472b6 100%)",
  "linear-gradient(160deg, #0f172a 0%, #1e40af 50%, #60a5fa 100%)",
  "linear-gradient(160deg, #1a0a0a 0%, #991b1b 50%, #f87171 100%)",
  "linear-gradient(160deg, #0f1f1a 0%, #064e3b 50%, #34d399 100%)",
];

const COVER_ACCENTS = [
  { dots: ["#c4b5fd", "#f9a8d4", "#a78bfa"], char: "#e8a598" },
  { dots: ["#fda4af", "#f9a8d4", "#fb7185"], char: "#f4a8c4" },
  { dots: ["#93c5fd", "#bfdbfe", "#60a5fa"], char: "#a8c4e8" },
  { dots: ["#fca5a5", "#fecaca", "#f87171"], char: "#e8a8a8" },
  { dots: ["#6ee7b7", "#a7f3d0", "#34d399"], char: "#a8e8c4" },
];

interface StoryCardProps {
  story: Story;
  index?: number;
  variant?: "large" | "medium" | "small";
}

export default function StoryCard({ story, index = 0, variant = "medium" }: StoryCardProps) {
  const router = useRouter();
  const gradIndex = index % COVER_GRADIENTS.length;
  const gradient = COVER_GRADIENTS[gradIndex];
  const accent = COVER_ACCENTS[gradIndex];
  const firstChapter = story.chapters.find((c) => !c.isLocked);

  const handleClick = () => {
    if (story.isComingSoon) return;
    router.push(`/story/${story.id}`);
  };

  if (variant === "large") {
    return (
      <motion.button
        onClick={handleClick}
        disabled={story.isComingSoon}
        whileHover={story.isComingSoon ? {} : { scale: 1.01 }}
        whileTap={story.isComingSoon ? {} : { scale: 0.98 }}
        className={`relative rounded-3xl overflow-hidden text-left w-full ${story.isComingSoon ? 'cursor-default opacity-90' : ''}`}
        style={{ height: "220px", background: gradient }}
      >
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover"
            style={{ filter: "brightness(0.85) contrast(1.1)" }}
          />
        ) : (
          <CoverDecoration accent={accent} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="absolute inset-0 p-5 flex flex-col justify-end">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              {story.isFeatured && (
                <span
                  className="text-xs font-medium tracking-widest uppercase px-2.5 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.9)" }}
                >
                  Featured
                </span>
              )}
              {story.isComingSoon && (
                <span
                  className="text-xs font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full"
                  style={{ background: "rgba(244,114,182,0.6)", color: "white" }}
                >
                  Coming Soon
                </span>
              )}
            </div>
            <h2
              className="text-2xl font-bold text-white leading-tight"
              style={{ fontFamily: "'Georgia', serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
            >
              {story.title}
            </h2>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              by {story.author}
            </p>
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "rgba(255,255,255,0.65)" }}>
              {story.synopsis}
            </p>
            <div className="flex items-center gap-2 mt-1">
              {story.genre.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="text-xs px-2.5 py-0.5 rounded-full"
                  style={{ background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.8)" }}
                >
                  {g}
                </span>
              ))}
              {story.isNew && (
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={{ background: "rgba(244,114,182,0.3)", color: "#fda4af" }}
                >
                  NEW
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      disabled={story.isComingSoon}
      whileHover={story.isComingSoon ? {} : { scale: 1.02, y: -2 }}
      whileTap={story.isComingSoon ? {} : { scale: 0.97 }}
      className={`relative rounded-2xl overflow-hidden text-left flex-shrink-0 ${story.isComingSoon ? 'cursor-default' : ''}`}
      style={{
        width: variant === "medium" ? "148px" : "120px",
        background: gradient,
      }}
    >
      {/* Cover illustration area */}
      <div
        className="relative overflow-hidden"
        style={{ height: variant === "medium" ? "180px" : "150px" }}
      >
        {story.coverImage ? (
          <Image
            src={story.coverImage}
            alt={story.title}
            fill
            className="object-cover"
            style={{ filter: "brightness(0.9) contrast(1.1)" }}
          />
        ) : (
          <CoverDecoration accent={accent} compact />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {story.isComingSoon && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: "rgba(244,114,182,0.8)", color: "#fff", fontSize: "8px" }}
            >
              COMING SOON
            </span>
          )}
          {story.isNew && !story.isComingSoon && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(244,114,182,0.4)", color: "#fce7f3", fontSize: "9px" }}
            >
              NEW
            </span>
          )}
          {story.isComplete && !story.isComingSoon && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "rgba(167,139,250,0.3)", color: "#ede9fe", fontSize: "9px" }}
            >
              COMPLETE
            </span>
          )}
        </div>
      </div>

      {/* Info area */}
      <div
        className="px-3 py-2.5"
        style={{ background: "rgba(15,10,30,0.85)", backdropFilter: "blur(8px)" }}
      >
        <p
          className="text-xs font-semibold leading-tight text-white line-clamp-1"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          {story.title}
        </p>
        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: "rgba(196,181,253,0.7)" }}>
          {story.author}
        </p>
      </div>
    </motion.button>
  );
}

function CoverDecoration({
  accent,
  compact,
}: {
  accent: { dots: string[]; char: string };
  compact?: boolean;
}) {
  return (
    <div className="absolute inset-0">
      {/* Background glow */}
      <div
        className="absolute"
        style={{
          bottom: compact ? "-20px" : "-30px",
          left: "50%",
          transform: "translateX(-50%)",
          width: compact ? "100px" : "160px",
          height: compact ? "100px" : "160px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${accent.char}30 0%, transparent 70%)`,
        }}
      />

      {/* Character silhouette */}
      <div
        className="absolute bottom-0 left-1/2"
        style={{
          transform: "translateX(-50%)",
          width: compact ? "70px" : "110px",
          height: compact ? "120px" : "185px",
        }}
      >
        <div
          className="w-full h-full"
          style={{
            borderRadius: "50% 50% 0 0",
            background: `linear-gradient(180deg, ${accent.char}80 0%, ${accent.char}20 70%, transparent 100%)`,
          }}
        />
        {/* Head */}
        <div
          className="absolute"
          style={{
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: compact ? "32px" : "52px",
            height: compact ? "36px" : "58px",
            borderRadius: "50%",
            background: accent.char + "aa",
          }}
        />
      </div>

      {/* Sparkle dots */}
      {accent.dots.map((color, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: compact ? "3px" : "5px",
            height: compact ? "3px" : "5px",
            background: color,
            top: `${20 + i * 15}%`,
            right: `${15 + i * 8}%`,
          }}
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </div>
  );
}
