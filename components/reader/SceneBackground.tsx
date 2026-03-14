"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface SceneBackgroundProps {
  sceneKey: string;
}

const BG_MAP: Record<string, string> = {
  rooftop_night: "/assets/bgs/bg_rooftop_night.png",
  night_city: "/assets/bgs/bg_rooftop_night.png", // fallback
  classroom: "/assets/bgs/bg_classroom.png",
  train_station: "/assets/bgs/bg_train_station.png",
  train_interior: "/assets/bgs/bg_train_station.png", // fallback
};

export default function SceneBackground({ sceneKey }: SceneBackgroundProps) {
  const bgImage = BG_MAP[sceneKey] || BG_MAP.rooftop_night;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={bgImage}
          initial={{ opacity: 0, scale: 1.1, x: -10 }}
          animate={{ 
            opacity: 1, 
            scale: [1.1, 1.02],
            x: [-10, 0],
          }}
          exit={{ opacity: 0, scale: 1 }}
          transition={{ 
            duration: 12, // Very slow, cinematic transition
            ease: "easeOut" 
          }}
          className="absolute inset-0"
        >
          <Image
            src={bgImage}
            alt="Scene Background"
            fill
            priority
            className="object-cover"
            style={{ filter: "brightness(0.9) contrast(1.1)" }}
          />
          {/* Subtle cinematic vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40 pointer-events-none" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
