"use client";

import { motion } from "framer-motion";
import { SceneEffect } from "@/types/story";

export default function AmbientEffect({ effect }: { effect?: SceneEffect }) {
  if (!effect || effect === "none") return null;

  switch (effect) {
    case "rain":
      return <RainEffect />;
    case "bokeh":
      return <BokehEffect />;
    case "particles":
      return <ParticlesEffect />;
    case "snow":
      return <SnowEffect />;
    default:
      return null;
  }
}

/* ─── Rain ─── */
function RainEffect() {
  const drops = Array.from({ length: 120 }, (_, i) => ({
    x: (i * 13) % 430,
    delay: Math.random() * 2,
    dur: 0.4 + Math.random() * 0.4,
    len: 15 + Math.random() * 15,
    opacity: 0.1 + Math.random() * 0.3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        <defs>
          <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="100%" stopColor="rgba(200,225,255,0.4)" />
          </linearGradient>
        </defs>
        {drops.map((d, i) => (
          <motion.line
            key={i}
            x1={d.x}
            y1={-d.len}
            x2={d.x - 1}
            y2={0}
            stroke="url(#rainGrad)"
            strokeWidth="1.2"
            animate={{
              y: [0, "110vh"],
            }}
            transition={{
              duration: d.dur,
              repeat: Infinity,
              delay: d.delay,
              ease: "linear",
            }}
          />
        ))}
      </svg>
      {/* Dynamic mist/fog during rain */}
      <motion.div 
        animate={{ opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-blue-900/10 backdrop-blur-[1px]" 
      />
    </div>
  );
}

/* ─── Bokeh ─── */
function BokehEffect() {
  const orbs = Array.from({ length: 20 }, (_, i) => ({
    x: Math.random() * 450,
    y: Math.random() * 700,
    size: 20 + Math.random() * 60,
    color: i % 3 === 0 ? "rgba(196,181,253,0.3)" : i % 3 === 1 ? "rgba(249,168,212,0.3)" : "rgba(252,211,77,0.3)",
    dur: 6 + Math.random() * 6,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }}>
      {orbs.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: o.x,
            top: o.y,
            width: o.size,
            height: o.size,
            background: o.color,
            filter: "blur(12px)",
          }}
          animate={{
            opacity: [0, 0.4, 0],
            scale: [0.8, 1.2, 0.8],
            y: [0, -40, 0],
          }}
          transition={{
            duration: o.dur,
            repeat: Infinity,
            delay: o.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Particles (fireflies/floating dust) ─── */
function ParticlesEffect() {
  const dots = Array.from({ length: 30 }, (_, i) => ({
    x: Math.random() * 430,
    y: Math.random() * 800,
    dur: 4 + Math.random() * 6,
    delay: Math.random() * 4,
    size: 2 + Math.random() * 3,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 4 }}>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: d.size,
            height: d.size,
            background: "#fcd34d",
            boxShadow: "0 0 10px 2px rgba(252,211,77,0.6)",
          }}
          animate={{
            x: [0, Math.random() * 40 - 20, 0],
            y: [0, Math.random() * -60, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: d.dur,
            repeat: Infinity,
            delay: d.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Snow ─── */
function SnowEffect() {
  const flakes = Array.from({ length: 60 }, (_, i) => ({
    x: Math.random() * 430,
    size: 2 + Math.random() * 5,
    dur: 6 + Math.random() * 6,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {flakes.map((f, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white shadow-[0_0_8px_white]"
          style={{ left: f.x, top: -20, width: f.size, height: f.size }}
          animate={{
            y: ["-5vh", "105vh"],
            x: [0, Math.random() * 30 - 15, 0],
            rotate: [0, 360],
          }}
          transition={{
            y: { duration: f.dur, repeat: Infinity, delay: f.delay, ease: "linear" },
            x: { duration: f.dur / 2, repeat: Infinity, delay: f.delay, ease: "easeInOut" },
            rotate: { duration: f.dur, repeat: Infinity, delay: f.delay, ease: "linear" },
          }}
        />
      ))}
    </div>
  );
}
