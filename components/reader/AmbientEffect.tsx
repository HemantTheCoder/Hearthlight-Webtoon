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
  const drops = Array.from({ length: 50 }, (_, i) => ({
    x: (i * 37) % 430,
    delay: (i * 0.07) % 2,
    dur: 0.6 + (i % 4) * 0.15,
    len: 12 + (i % 5) * 4,
    opacity: 0.2 + (i % 3) * 0.1,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {drops.map((d, i) => (
          <motion.line
            key={i}
            x1={d.x}
            y1={-d.len}
            x2={d.x - 2}
            y2={0}
            stroke="rgba(180,210,255,0.5)"
            strokeWidth="0.8"
            animate={{
              y: [0, "100vh"],
              opacity: [d.opacity, d.opacity * 0.5, d.opacity],
            }}
            transition={{
              y: { duration: d.dur, repeat: Infinity, delay: d.delay, ease: "linear" },
              opacity: { duration: d.dur, repeat: Infinity, delay: d.delay },
            }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ─── Bokeh ─── */
function BokehEffect() {
  const orbs = Array.from({ length: 14 }, (_, i) => ({
    x: (i * 73 + 30) % 400,
    y: (i * 111 + 50) % 600,
    size: 8 + (i % 6) * 8,
    color: i % 3 === 0 ? "#c4b5fd" : i % 3 === 1 ? "#f9a8d4" : "#fcd34d",
    dur: 4 + (i % 4),
    delay: i * 0.4,
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
            filter: "blur(6px)",
            opacity: 0,
          }}
          animate={{
            opacity: [0, 0.3, 0.15, 0.3, 0],
            y: [0, -20, 0],
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

/* ─── Particles (fireflies) ─── */
function ParticlesEffect() {
  const dots = Array.from({ length: 16 }, (_, i) => ({
    x: (i * 60 + 20) % 400,
    y: 400 + (i * 40) % 300,
    dur: 3 + (i % 5),
    delay: i * 0.3,
    dx: (i % 2 === 0 ? 1 : -1) * (5 + (i % 4) * 3),
    dy: -(8 + i * 3),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 2 }}>
      {dots.map((d, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: d.x,
            top: d.y,
            width: 3,
            height: 3,
            background: "#f9a8d4",
            boxShadow: "0 0 6px 2px #f9a8d480",
          }}
          animate={{
            x: [0, d.dx, 0],
            y: [0, d.dy, 0],
            opacity: [0, 0.9, 0],
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
  const flakes = Array.from({ length: 30 }, (_, i) => ({
    x: (i * 53) % 430,
    size: 3 + (i % 4),
    dur: 4 + (i % 5),
    delay: (i * 0.2) % 3,
    dx: (i % 2 === 0 ? 1 : -1) * (5 + (i % 3) * 3),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
      {flakes.map((f, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{ left: f.x, top: -10, width: f.size, height: f.size, opacity: 0.7 }}
          animate={{
            y: ["0px", "100vh"],
            x: [0, f.dx, 0],
          }}
          transition={{
            y: { duration: f.dur, repeat: Infinity, delay: f.delay, ease: "linear" },
            x: { duration: f.dur / 2, repeat: Infinity, delay: f.delay, ease: "easeInOut" },
          }}
        />
      ))}
    </div>
  );
}
