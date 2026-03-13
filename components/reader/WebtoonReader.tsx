"use client";

import { motion } from "framer-motion";
import { DialogueNode } from "@/types/story";

interface WebtoonReaderProps {
  nodes: DialogueNode[];
  currentNodeIndex: number;
  onScrollToChoice: () => void;
}

const PANEL_IMAGES: Record<string, string> = {
  coffee: "/assets/panels/panel_coffee.png",
  eye: "/assets/panels/panel_eye.png",
  crane: "/assets/panels/panel_crane.png",
};

const CHAR_IMAGES: Record<string, string> = {
  eleanor: "/assets/chars/eleanor_neutral.png",
  aoi: "/assets/chars/aoi_neutral.png",
  hana: "/assets/chars/hana_neutral.png",
};

const PANEL_HEIGHTS: Record<string, string> = {
  wide: "260px",
  half: "200px",
  close: "180px",
  full: "320px",
};

const SCENE_DARK: Record<string, boolean> = {
  rooftop_night: true,
  night_city: true,
  train_station: true,
  train_interior: true,
  classroom: false,
};

const SCENE_BG: Record<string, string[]> = {
  rooftop_night: ["#1a1033", "#2d1b69", "#0f0c29"],
  night_city: ["#0f0c29", "#302b63"],
  train_station: ["#1a2a3a", "#243448"],
  train_interior: ["#1e2a38", "#2c3e50"],
  classroom: ["#fff8e8", "#ffefd0"],
};

function getCharColor(characterId?: string): string {
  if (!characterId) return "#c4b5fd";
  if (characterId === "eleanor") return "#e8a598";
  if (characterId === "aoi") return "#a8c4e8";
  if (characterId === "hana") return "#f4a8c4";
  return "#c4b5fd";
}

export default function WebtoonReader({ nodes, currentNodeIndex }: WebtoonReaderProps) {
  const visibleNodes = nodes.slice(0, currentNodeIndex + 1).filter((n) => n.type !== "choice");

  return (
    <div className="flex flex-col gap-1 pb-4">
      {visibleNodes.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.25) }}
        >
          <WebtoonPanel node={node} panelIndex={index} />
        </motion.div>
      ))}

      {nodes[currentNodeIndex]?.type === "choice" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-4 mt-2">
          <div
            className="rounded-2xl px-4 py-3 flex items-center justify-center gap-2"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(168,85,247,0.12))",
              border: "1px dashed rgba(196,181,253,0.4)",
            }}
          >
            <span className="text-sm" style={{ color: "#7c3aed" }}>A choice awaits...</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function WebtoonPanel({ node, panelIndex }: { node: DialogueNode; panelIndex: number }) {
  const panelType = node.webtoonPanel?.type ?? "half";
  const height = PANEL_HEIGHTS[panelType] ?? "200px";
  const bg = node.background;
  const colors = bg ? (SCENE_BG[bg] ?? ["#f5f0ff", "#ede9fe"]) : ["#f5f0ff", "#ede9fe"];
  const isDark = bg ? (SCENE_DARK[bg] ?? false) : false;
  const isWide = panelType === "wide" || panelType === "full";
  const character = node.characters?.[0];

  // If this node explicitly calls for a cinematic image via its background or a special prop
  const cinematicImage = node.cinematicImage ? PANEL_IMAGES[node.cinematicImage] : null;

  return (
    <div
      className="relative overflow-hidden"
      style={{
        height,
        background: cinematicImage ? "#000" : `linear-gradient(160deg, ${colors[0]} 0%, ${colors[colors.length - 1]} 100%)`,
        margin: isWide ? "0" : "0 4px",
        borderRadius: isWide ? "0" : "12px",
      }}
    >
      {/* Cinematic Image Rendering (Director's Cut) */}
      {cinematicImage ? (
        <motion.div
           initial={{ scale: 1.05 }}
           animate={{ scale: 1 }}
           transition={{ duration: 6, ease: "linear" }}
           className="absolute inset-0"
        >
          <img 
            src={cinematicImage} 
            alt="Cinematic frame" 
            className="w-full h-full object-cover opacity-90"
          />
        </motion.div>
      ) : (
        <>
          {/* Atmospheric overlay for normal vector-style panels */}
          <div
            className="absolute inset-0"
            style={{
              background: isDark
                ? "radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.12) 0%, transparent 70%)"
                : "radial-gradient(ellipse at 70% 30%, rgba(244,114,182,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Character Image overlay */}
          {character && (
            <div
              className="absolute bottom-0 right-4 pointer-events-none"
              style={{
                width: "110px",
                height: "170px",
              }}
            >
              <img 
                src={CHAR_IMAGES[character.characterId] || CHAR_IMAGES.eleanor} 
                alt="character"
                className="w-full h-full object-contain object-bottom"
                style={{ 
                  mixBlendMode: "multiply", 
                  opacity: 0.85, 
                  filter: "contrast(1.15) saturate(1.1)" 
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Content box */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        ...
        {(node.type === "narration" || node.type === "panel") ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="self-start max-w-xs rounded-xl px-3 py-2"
            style={{
              background: isDark || cinematicImage ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.75)",
              backdropFilter: "blur(8px)",
              border: isDark || cinematicImage ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(196,181,253,0.3)",
            }}
          >
            {node.webtoonPanel?.caption && (
              <p style={{ color: isDark || cinematicImage ? "rgba(196,181,253,0.7)" : "#9f7aea", fontSize: "9px", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "4px" }}>
                {node.webtoonPanel.caption}
              </p>
            )}
            <p className="text-xs leading-relaxed"
              style={{ color: isDark || cinematicImage ? "rgba(255,255,255,0.95)" : "#374151", fontStyle: "italic", fontFamily: "'Georgia', serif", textShadow: cinematicImage ? "0 1px 2px rgba(0,0,0,0.8)" : "none" }}>
              {node.text}
            </p>
          </motion.div>
        ) : node.type === "dialogue" ? (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="relative rounded-2xl px-3 py-2.5 mr-20 shadow-lg"
            style={{
              background: isDark || cinematicImage ? "rgba(15,10,30,0.85)" : "rgba(255,255,255,0.92)",
              backdropFilter: "blur(12px)",
              border: isDark || cinematicImage ? "1px solid rgba(196,181,253,0.18)" : "1px solid rgba(196,181,253,0.3)",
            }}
          >
            {node.speaker && (
              <p className="text-xs font-semibold mb-1" style={{ color: "#a78bfa", fontFamily: "'Georgia', serif" }}>
                {node.speaker}
              </p>
            )}
            <p className="text-xs leading-relaxed"
              style={{ color: isDark || cinematicImage ? "rgba(255,255,255,0.9)" : "#1e1038", fontStyle: "italic", fontFamily: "'Georgia', serif" }}>
              &ldquo;{node.text}&rdquo;
            </p>
            <div className="absolute right-[-5px] bottom-3 w-3 h-3"
              style={{ background: isDark || cinematicImage ? "rgba(15,10,30,0.85)" : "rgba(255,255,255,0.92)", clipPath: "polygon(0 0, 0 100%, 100% 50%)" }} />
          </motion.div>
        ) : null}
      </div>

      <div className="absolute inset-0 pointer-events-none" style={{ border: "1px solid rgba(255,255,255,0.04)" }} />
    </div>
  );
}
