"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { HistoryEntry } from "@/types/story";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryEntry[];
  onRewind: (entry: HistoryEntry) => void;
}

export default function HistoryDrawer({ isOpen, onClose, history, onRewind }: HistoryDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
            style={{ background: "rgba(10, 6, 20, 0.5)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="absolute top-0 right-0 bottom-0 z-40 flex flex-col"
            style={{
              width: "88%",
              background: "rgba(255,255,255,0.96)",
              backdropFilter: "blur(20px)",
              boxShadow: "-8px 0 40px rgba(0,0,0,0.25)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "1px solid rgba(196,181,253,0.3)" }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: "#2d1b4e", fontFamily: "'Georgia', serif" }}
              >
                Your Path
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(196,181,253,0.2)" }}
              >
                <X size={16} style={{ color: "#6b46c1" }} />
              </button>
            </div>

            {/* Timeline */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {history.length === 0 ? (
                <p className="text-center text-sm mt-8" style={{ color: "#9ca3af" }}>
                  Your story is just beginning...
                </p>
              ) : (
                <div className="relative">
                  {/* Vertical line */}
                  <div
                    className="absolute left-3 top-2 bottom-2 w-px"
                    style={{ background: "linear-gradient(180deg, #c4b5fd, #f9a8d4)" }}
                  />

                  <div className="flex flex-col gap-0">
                    {history.map((entry, index) => (
                      <HistoryItem
                        key={`${entry.nodeId}-${index}`}
                        entry={entry}
                        isLatest={index === history.length - 1}
                        onRewind={onRewind}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function HistoryItem({
  entry,
  isLatest,
  onRewind,
}: {
  entry: HistoryEntry;
  isLatest: boolean;
  onRewind: (entry: HistoryEntry) => void;
}) {
  const timeAgo = getTimeAgo(entry.timestamp);

  return (
    <button
      onClick={() => !isLatest && onRewind(entry)}
      className="relative flex items-start gap-4 py-3 text-left w-full group"
      disabled={isLatest}
    >
      {/* Timeline dot */}
      <div className="relative z-10 mt-1 flex-shrink-0" style={{ width: "24px" }}>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: entry.isChoice
              ? "linear-gradient(135deg, #a78bfa, #f472b6)"
              : isLatest
              ? "rgba(196,181,253,0.4)"
              : "white",
            border: entry.isChoice
              ? "none"
              : `2px solid ${isLatest ? "#c4b5fd" : "#e5e7eb"}`,
            boxShadow: entry.isChoice ? "0 2px 8px rgba(167,139,250,0.4)" : "none",
          }}
        >
          {entry.isChoice && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
              <path d="M1 4l3 3L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="flex-1 rounded-xl px-3 py-2.5 min-w-0 transition-all"
        style={{
          background: entry.isChoice
            ? "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(244,114,182,0.08))"
            : "rgba(248,245,255,0.8)",
          border: entry.isChoice ? "1px solid rgba(196,181,253,0.3)" : "1px solid rgba(229,225,245,0.8)",
        }}
      >
        {entry.speaker && (
          <p
            className="text-xs font-semibold mb-0.5"
            style={{
              color: entry.isChoice ? "#7c3aed" : "#6b7280",
              letterSpacing: "0.02em",
            }}
          >
            {entry.isChoice ? "YOU CHOSE" : entry.speaker}
          </p>
        )}
        <p
          className="text-sm leading-snug line-clamp-2"
          style={{
            color: entry.isChoice ? "#2d1b4e" : "#374151",
            fontFamily: "'Georgia', serif",
            fontStyle: "italic",
          }}
        >
          "{entry.text}"
        </p>
        <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
          {timeAgo}
        </p>
      </div>
    </button>
  );
}

function getTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
