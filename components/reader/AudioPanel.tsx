"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState } from "react";

interface AudioPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AudioPanel({ isOpen, onClose }: AudioPanelProps) {
  const [masterMute, setMasterMute] = useState(false);
  const [ambience, setAmbience] = useState(65);
  const [effects, setEffects] = useState(40);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30"
            style={{ background: "rgba(10,6,20,0.5)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="absolute left-4 right-4 z-40 rounded-3xl p-6"
            style={{
              top: "50%",
              transform: "translateY(-50%)",
              background: "rgba(255,255,255,0.95)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2
                className="text-lg font-semibold"
                style={{ color: "#1e1038", fontFamily: "'Georgia', serif" }}
              >
                Soundscape
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: "rgba(196,181,253,0.2)" }}
              >
                <X size={16} style={{ color: "#6b46c1" }} />
              </button>
            </div>

            {/* Master mute */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #fce7f3, #ede9fe)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M11 5L6 9H2v6h4l5 4V5z" fill="#a78bfa" />
                    {!masterMute && (
                      <path d="M15.54 8.46a5 5 0 010 7.07M19.07 4.93a10 10 0 010 14.14" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" />
                    )}
                    {masterMute && (
                      <path d="M23 9l-6 6M17 9l6 6" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
                    )}
                  </svg>
                </div>
                <span className="text-sm font-medium" style={{ color: "#374151" }}>
                  Master Mute
                </span>
              </div>

              {/* Toggle */}
              <button
                onClick={() => setMasterMute(!masterMute)}
                className="relative"
                style={{ width: "48px", height: "28px" }}
              >
                <div
                  className="w-full h-full rounded-full transition-colors duration-300"
                  style={{
                    background: masterMute
                      ? "rgba(209,213,219,1)"
                      : "linear-gradient(135deg, #7c3aed, #a855f7)",
                  }}
                />
                <motion.div
                  animate={{ x: masterMute ? 2 : 22 }}
                  transition={{ type: "spring", damping: 20, stiffness: 400 }}
                  className="absolute top-1 w-5 h-5 rounded-full bg-white"
                  style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}
                />
              </button>
            </div>

            {/* Ambience */}
            <div className="mb-5">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: "#374151" }}>
                  Ambience
                </span>
                <span className="text-xs" style={{ color: "#a78bfa" }}>
                  Rainy City
                </span>
              </div>
              <VolumeSlider value={ambience} onChange={setAmbience} disabled={masterMute} />
            </div>

            {/* Effects */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium" style={{ color: "#374151" }}>
                  Effects
                </span>
              </div>
              <VolumeSlider value={effects} onChange={setEffects} disabled={masterMute} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function VolumeSlider({
  value,
  onChange,
  disabled,
}: {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}) {
  return (
    <div className="relative h-5 flex items-center">
      <div
        className="relative w-full h-1.5 rounded-full overflow-hidden"
        style={{ background: "rgba(196,181,253,0.2)" }}
      >
        <div
          className="absolute left-0 top-0 bottom-0 rounded-full transition-all"
          style={{
            width: `${value}%`,
            background: disabled
              ? "rgba(209,213,219,0.8)"
              : "linear-gradient(90deg, #a78bfa, #f472b6)",
          }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="absolute inset-0 w-full opacity-0 cursor-pointer"
      />
      {/* Thumb */}
      <div
        className="absolute w-4 h-4 rounded-full pointer-events-none"
        style={{
          left: `calc(${value}% - 8px)`,
          background: disabled ? "#d1d5db" : "white",
          boxShadow: "0 2px 8px rgba(124,58,237,0.3)",
          border: disabled ? "2px solid #d1d5db" : "2px solid #a78bfa",
        }}
      />
    </div>
  );
}
