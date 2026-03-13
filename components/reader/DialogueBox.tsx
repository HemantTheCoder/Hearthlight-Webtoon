"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface DialogueBoxProps {
  character?: string;
  text: string;
  onNext: () => void;
  isLastNode?: boolean;
}

export default function DialogueBox({ character, text, onNext, isLastNode }: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    setDisplayedText("");
    setIsComplete(false);
    setCharIndex(0);
  }, [text]);

  useEffect(() => {
    if (charIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, charIndex + 1));
        setCharIndex((i) => i + 1);
      }, 22);
      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [charIndex, text]);

  const handleClick = () => {
    if (!isComplete) {
      setDisplayedText(text);
      setCharIndex(text.length);
      setIsComplete(true);
    } else {
      onNext();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mx-4 mb-4 cursor-pointer"
      onClick={handleClick}
    >
      <div
        className="relative rounded-2xl p-4 pt-5"
        style={{
          background: "rgba(15, 10, 30, 0.82)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(180, 140, 220, 0.25)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Accent line */}
        <div
          className="absolute left-4 top-0 bottom-0 w-0.5 rounded-full"
          style={{
            background: "linear-gradient(180deg, #a78bfa 0%, #f472b6 100%)",
          }}
        />

        {/* Character name */}
        {character && (
          <div className="mb-2 pl-3">
            <span
              className="text-sm font-semibold tracking-wide"
              style={{
                color: "#c4b5fd",
                fontFamily: "'Georgia', serif",
              }}
            >
              {character}
            </span>
          </div>
        )}

        {/* Dialogue text */}
        <div className="pl-3 pr-2">
          <p
            className="text-sm leading-relaxed"
            style={{
              color: "rgba(255,255,255,0.92)",
              fontFamily: "'Georgia', 'Times New Roman', serif",
              minHeight: "3.5rem",
            }}
          >
            {displayedText}
            {!isComplete && (
              <span
                className="inline-block w-0.5 h-4 ml-0.5 align-middle"
                style={{
                  background: "#c4b5fd",
                  animation: "blink 1s step-end infinite",
                }}
              />
            )}
          </p>
        </div>

        {/* Next indicator */}
        {isComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end mt-2 pr-1"
          >
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={18} style={{ color: "#c4b5fd" }} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
