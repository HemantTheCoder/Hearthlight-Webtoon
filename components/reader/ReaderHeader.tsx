"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Search, RotateCcw, Volume2, MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";

interface ReaderHeaderProps {
  title: string;
  mode: "vn" | "webtoon";
  onModeToggle: () => void;
  onHistoryOpen: () => void;
  onAudioOpen: () => void;
  onRewindOpen: () => void;
}

export default function ReaderHeader({
  title,
  mode,
  onModeToggle,
  onHistoryOpen,
  onAudioOpen,
  onRewindOpen,
}: ReaderHeaderProps) {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-between px-3 py-3 z-10 relative"
      style={{
        background:
          mode === "vn"
            ? "rgba(15,10,30,0.7)"
            : "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${mode === "vn" ? "rgba(196,181,253,0.15)" : "rgba(196,181,253,0.3)"}`,
      }}
    >
      {/* Left: back + title */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={() => router.back()}
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{
            background:
              mode === "vn" ? "rgba(255,255,255,0.1)" : "rgba(196,181,253,0.15)",
          }}
        >
          <ArrowLeft
            size={16}
            style={{ color: mode === "vn" ? "rgba(255,255,255,0.9)" : "#6b46c1" }}
          />
        </button>

        <span
          className="text-sm font-medium truncate"
          style={{
            color: mode === "vn" ? "rgba(255,255,255,0.85)" : "#2d1b4e",
            fontFamily: "'Georgia', serif",
            maxWidth: "120px",
          }}
        >
          {title}
        </span>

        {/* Mode dots */}
        <div className="flex gap-0.5 ml-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: i === 0 ? "6px" : "4px",
                height: i === 0 ? "6px" : "4px",
                background:
                  mode === "vn"
                    ? i === 0
                      ? "#c4b5fd"
                      : "rgba(196,181,253,0.4)"
                    : i === 0
                    ? "#f472b6"
                    : "rgba(244,114,182,0.4)",
              }}
            />
          ))}
        </div>
      </div>

      {/* Right: controls */}
      <div className="flex items-center gap-1.5">
        {/* Mode toggle */}
        <button
          onClick={onModeToggle}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium"
          style={{
            background:
              mode === "webtoon"
                ? "linear-gradient(135deg, #f472b6, #a855f7)"
                : "rgba(255,255,255,0.12)",
            color: mode === "webtoon" ? "white" : "rgba(255,255,255,0.8)",
            border:
              mode === "vn"
                ? "1px solid rgba(255,255,255,0.15)"
                : "none",
          }}
        >
          {mode === "webtoon" ? (
            <>
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "rgba(255,255,255,0.9)" }}
              />
              Webtoon
            </>
          ) : (
            "VN"
          )}
        </button>

        {/* Rewind */}
        <button
          onClick={onRewindOpen}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background:
              mode === "vn" ? "rgba(255,255,255,0.1)" : "rgba(196,181,253,0.15)",
          }}
        >
          <RotateCcw
            size={14}
            style={{ color: mode === "vn" ? "rgba(255,255,255,0.8)" : "#6b46c1" }}
          />
        </button>

        {/* History */}
        <button
          onClick={onHistoryOpen}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background:
              mode === "vn" ? "rgba(255,255,255,0.1)" : "rgba(196,181,253,0.15)",
          }}
        >
          <Search
            size={14}
            style={{ color: mode === "vn" ? "rgba(255,255,255,0.8)" : "#6b46c1" }}
          />
        </button>

        {/* Audio */}
        <button
          onClick={onAudioOpen}
          className="w-8 h-8 rounded-full flex items-center justify-center"
          style={{
            background:
              mode === "vn" ? "rgba(255,255,255,0.1)" : "rgba(196,181,253,0.15)",
          }}
        >
          <Volume2
            size={14}
            style={{ color: mode === "vn" ? "rgba(255,255,255,0.8)" : "#6b46c1" }}
          />
        </button>
      </div>
    </div>
  );
}
