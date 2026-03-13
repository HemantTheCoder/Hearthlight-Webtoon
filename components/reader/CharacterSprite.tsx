"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface CharacterSpriteProps {
  spriteKey?: string;
  characterName?: string;
  mood?: string;
}

// Map logical character states to the actual image asset paths
const CHAR_IMAGES: Record<string, string> = {
  eleanor_neutral: "/assets/chars/eleanor_neutral.png",
  eleanor_happy: "/assets/chars/eleanor_happy.png",
  eleanor_shy: "/assets/chars/eleanor_shy.png",
  eleanor_surprised: "/assets/chars/eleanor_surprised.png",
  eleanor_sad: "/assets/chars/eleanor_sad.png",
  aoi_neutral: "/assets/chars/aoi_neutral.png",
  aoi_sad: "/assets/chars/aoi_sad.png",
  hana_neutral: "/assets/chars/hana_neutral.png",
  hana_flustered: "/assets/chars/hana_flustered.png",
};

export default function CharacterSprite({ spriteKey, characterName, mood }: CharacterSpriteProps) {
  // Determine which character we are showing
  const baseChar = spriteKey?.split("_")[0] || "eleanor";
  // Determine emotion based on explicitly passed mood or from the spriteKey
  let expression = "neutral";
  if (mood) expression = mood;
  else if (spriteKey?.includes("happy")) expression = "happy";
  else if (spriteKey?.includes("shy")) expression = "shy";
  else if (spriteKey?.includes("surprised")) expression = "surprised";
  else if (spriteKey?.includes("sad")) expression = "sad";
  else if (spriteKey?.includes("flustered")) expression = "flustered";

  const imageKey = `${baseChar}_${expression}`;
  // Fallback to neutral if the specific expression doesn't exist for that character
  const imageSrc = CHAR_IMAGES[imageKey] || CHAR_IMAGES[`${baseChar}_neutral`] || CHAR_IMAGES.eleanor_neutral;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={imageSrc}
        initial={{ opacity: 0, y: 15, filter: "blur(4px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center pointer-events-none"
        style={{ zIndex: 10 }} // Ensure character is behind dialogue box but over background
      >
        {/* Breathing motion wrapper */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="relative"
          // Adjust height so the waist sits naturally at the bottom
          style={{ width: "260px", height: "420px" }}
        >
          <Image
            src={imageSrc}
            alt={characterName || baseChar}
            fill
            priority
            className="object-contain object-bottom"
            style={{ 
              // The generated images might have white or checkerboard backgrounds
              // Using multiply blends white/checkerboard out nicely against dark backgrounds
              mixBlendMode: "multiply",
              filter: "contrast(1.1) saturate(1.1)"
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
