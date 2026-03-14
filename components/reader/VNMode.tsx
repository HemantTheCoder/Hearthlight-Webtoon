"use client";

import { motion, AnimatePresence } from "framer-motion";
import { DialogueNode, Choice, CharacterOnStage, Story } from "@/types/story";
import CharacterSprite from "@/components/reader/CharacterSprite";
import DialogueBox from "@/components/reader/DialogueBox";

const PANEL_IMAGES: Record<string, string> = {
  coffee: "/assets/panels/panel_coffee.png",
  eye: "/assets/panels/panel_eye.png",
  crane: "/assets/panels/panel_crane.png",
  rooftop_look: "/assets/bgs/bg_rooftop_night.png",
};

export default function VNMode({
  story,
  currentNode,
  onNext,
  onChoice,
}: {
  story: Story;
  currentNode: DialogueNode;
  onNext: () => void;
  onChoice: (c: Choice) => void;
}) {
  if (!currentNode) return null;

  const isChoice = currentNode.type === "choice";
  const isPanel = currentNode.type === "panel";
  const isNarration = currentNode.type === "narration";
  const isDialogue = currentNode.type === "dialogue" || !currentNode.type; // Default to dialogue if undefined

  const characters = currentNode.characters || [];
  const hasCharacters = characters.length > 0;

  // Resolve cinematic image
  const cinematicSrc = currentNode.cinematicImage 
    ? (PANEL_IMAGES[currentNode.cinematicImage] || currentNode.cinematicImage) 
    : null;

  return (
    <div className="flex-1 flex flex-col relative" style={{ minHeight: 0 }}>

      {/* ── Character stage (65-75% of screen) ── */}
      <div
        className="flex-1 relative flex items-end justify-center overflow-hidden"
        style={{ minHeight: 0 }}
        onClick={isNarration || isPanel ? onNext : undefined}
      >
        {/* Panel narration overlay */}
        {isPanel && (
           <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center cursor-pointer"
              style={{ zIndex: 6 }}
              onClick={onNext}
            >
              <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.85)" }} />
              
              {cinematicSrc && (
                <motion.img
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  transition={{ duration: 0.8 }}
                  src={cinematicSrc}
                  alt="Cinematic Panel"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              <div className="relative px-8 text-center" style={{ zIndex: 10 }}>
                {currentNode.webtoonPanel?.caption && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xs mb-3 tracking-widest uppercase"
                    style={{ color: "rgba(196,181,253,0.7)" }}
                  >
                    {currentNode.webtoonPanel.caption}
                  </motion.p>
                )}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-lg leading-relaxed"
                  style={{
                    color: "rgba(255,255,255,0.92)",
                    fontFamily: "'Georgia', serif",
                    fontStyle: "italic",
                    textShadow: "0 2px 16px rgba(0,0,0,0.8)",
                  }}
                >
                  {currentNode.text}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 text-xs"
                  style={{ color: "rgba(196,181,253,0.5)" }}
                >
                  tap to continue
                </motion.p>
              </div>
            </motion.div>
        )}

        {/* Narration overlay (no character) */}
        {isNarration && !hasCharacters && (
          <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-4 flex items-center justify-center cursor-pointer"
              style={{ zIndex: 6 }}
              onClick={onNext}
            >
              <div
                className="rounded-2xl px-6 py-5 text-center max-w-xs"
                style={{
                  background: "rgba(10,6,20,0.65)",
                  backdropFilter: "blur(16px)",
                  border: "1px solid rgba(196,181,253,0.15)",
                }}
              >
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "rgba(255,255,255,0.88)", fontStyle: "italic", fontFamily: "'Georgia', serif" }}
                >
                  {currentNode.text}
                </p>
                <motion.p
                  animate={{ opacity: [0.3, 0.8, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="mt-4 text-xs"
                  style={{ color: "rgba(196,181,253,0.6)" }}
                >
                  tap to continue
                </motion.p>
              </div>
            </motion.div>
        )}

        {/* Character sprites on stage */}
        <AnimatePresence>
          {hasCharacters && characters.map((char) => {
            const charData = story.characters.find((c) => c.name === char.characterId || c.id === char.characterId);
            if (!charData) return null;
            
            const posStyle: React.CSSProperties =
              char.position === "left"
                ? { left: "5%", bottom: 0 }
                : char.position === "right"
                ? { right: "5%", bottom: 0 }
                : { left: "50%", transform: "translateX(-50%)", bottom: 0 };
          
            const spriteKey = `${charData.palette}_${char.expression}`;

            return (
               <motion.div
                  key={`${char.characterId}-${char.position}`}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{
                    opacity: char.highlighted === false ? 0.4 : 1,
                    y: 0,
                    scale: 1,
                    filter: char.highlighted === false ? "brightness(0.5)" : "brightness(1)",
                  }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute"
                  style={{ ...posStyle, width: "260px", height: "360px" }}
                >
                  <CharacterSprite spriteKey={spriteKey} characterName={char.characterId} mood={char.expression} />
                </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Narration text over scene when characters are present */}
        {isNarration && hasCharacters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-4 left-4 right-4"
            style={{ zIndex: 6 }}
          >
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: "rgba(10,6,20,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-xs leading-relaxed text-center"
                style={{ color: "rgba(255,255,255,0.85)", fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
                {currentNode.text}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* ── Dialogue box (bottom) ── */}
      {isDialogue && (
        <div className="relative" style={{ zIndex: 10 }}>
          <DialogueBox
            character={currentNode.speaker}
            text={currentNode.text}
            onNext={onNext}
          />
        </div>
      )}
    </div>
  );
}
