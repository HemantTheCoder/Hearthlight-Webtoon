"use client";

import { motion, AnimatePresence } from "framer-motion";

interface RewindModalProps {
  isOpen: boolean;
  onKeepReading: () => void;
  onRewind: () => void;
}

export default function RewindModal({ isOpen, onKeepReading, onRewind }: RewindModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center px-8"
          style={{ background: "rgba(10, 6, 20, 0.6)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: "spring", damping: 24, stiffness: 300 }}
            className="w-full max-w-xs rounded-3xl p-7 flex flex-col items-center"
            style={{
              background: "rgba(255,255,255,0.97)",
              boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
            }}
          >
            {/* Icon */}
            <motion.div
              animate={{ rotate: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
              style={{ background: "linear-gradient(135deg, #ede9fe, #fce7f3)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 16.5C5.07 15.41 3.5 13.3 3.5 11a8.5 8.5 0 1117 0c0 2.3-1.57 4.41-3.5 5.5"
                  stroke="#7c3aed"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M12 21V12M9 15l3-3 3 3"
                  stroke="#7c3aed"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* Title */}
            <h2
              className="text-xl font-bold mb-2 text-center"
              style={{ color: "#1e1038", fontFamily: "'Georgia', serif" }}
            >
              Rewind Story?
            </h2>

            {/* Subtitle */}
            <p
              className="text-sm text-center mb-7 leading-relaxed"
              style={{ color: "#6b7280" }}
            >
              Return to this moment? Future progress will be saved as an alternate path.
            </p>

            {/* Buttons */}
            <div className="flex gap-3 w-full">
              <button
                onClick={onKeepReading}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-all"
                style={{
                  background: "rgba(196,181,253,0.15)",
                  color: "#6b46c1",
                  border: "1px solid rgba(196,181,253,0.4)",
                }}
              >
                Keep Reading
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRewind}
                className="flex-1 py-3 rounded-2xl text-sm font-semibold"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  color: "white",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                }}
              >
                Rewind
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
