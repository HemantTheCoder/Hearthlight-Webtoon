"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Choice } from "@/types/story";

interface ChoiceModalProps {
  isOpen: boolean;
  prompt: string;
  choices: Choice[];
  onChoice: (choice: Choice) => void;
}

export default function ChoiceModal({ isOpen, prompt, choices, onChoice }: ChoiceModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 flex flex-col items-center justify-center z-20 px-6"
          style={{ background: "rgba(10, 6, 20, 0.65)", backdropFilter: "blur(4px)" }}
        >
          {/* Prompt */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-6"
          >
            <p
              className="text-center text-base font-semibold"
              style={{
                color: "rgba(255,255,255,0.9)",
                fontFamily: "'Georgia', serif",
                textShadow: "0 2px 12px rgba(0,0,0,0.8)",
              }}
            >
              {prompt}
            </p>
          </motion.div>

          {/* Choice cards */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {choices.map((choice, index) => (
              <motion.button
                key={choice.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.15 + index * 0.08, duration: 0.35 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChoice(choice)}
                className="relative rounded-2xl px-5 py-4 text-left overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.95)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25), 0 1px 0 rgba(255,255,255,0.5)",
                  border: "1px solid rgba(196,181,253,0.4)",
                }}
              >
                {/* Left accent border */}
                <div
                  className="absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full"
                  style={{
                    background: "linear-gradient(180deg, #a78bfa, #f472b6)",
                  }}
                />
                <p
                  className="text-sm leading-snug pl-3"
                  style={{
                    color: "#2d1b4e",
                    fontFamily: "'Georgia', serif",
                    fontStyle: "italic",
                  }}
                >
                  {choice.text}
                </p>

                {/* Hover shimmer */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    background: "linear-gradient(135deg, rgba(167,139,250,0.06) 0%, rgba(244,114,182,0.06) 100%)",
                  }}
                />
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
