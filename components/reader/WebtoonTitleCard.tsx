"use client";

import { motion } from "framer-motion";

interface WebtoonTitleCardProps {
  storyTitle: string;
  chapterNumber: number;
  chapterTitle: string;
}

export default function WebtoonTitleCard({
  storyTitle,
  chapterNumber,
  chapterTitle,
}: WebtoonTitleCardProps) {
  return (
    <div
      className="relative flex flex-col items-center justify-center text-center overflow-hidden"
      style={{
        height: "100vh",
        background: "linear-gradient(180deg, #1a0f35 0%, #0f0a1e 100%)",
        borderBottom: "1px solid rgba(196,181,253,0.1)",
      }}
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px]"
          style={{ background: "rgba(124, 58, 237, 0.15)" }}
        />
        <div 
          className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full blur-[120px]"
          style={{ background: "rgba(244, 114, 182, 0.1)" }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 px-8"
      >
        <p 
          className="text-xs tracking-[0.3em] uppercase mb-4"
          style={{ color: "rgba(196,181,253,0.6)" }}
        >
          {storyTitle}
        </p>
        
        <h1 
          className="text-4xl md:text-5xl font-bold mb-4"
          style={{ 
            fontFamily: "'Georgia', serif",
            background: "linear-gradient(135deg, #fff 30%, #c4b5fd 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Chapter {chapterNumber}
        </h1>
        
        <div 
          className="w-12 h-px mx-auto mb-6"
          style={{ background: "rgba(196,181,253,0.3)" }}
        />
        
        <h2 
          className="text-xl italic font-light"
          style={{ 
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: "'Georgia', serif"
          }}
        >
          {chapterTitle}
        </h2>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] uppercase tracking-widest text-white/30">Scroll to begin</span>
        <motion.div 
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-px h-8 bg-gradient-to-b from-purple-500 to-transparent"
        />
      </motion.div>
    </div>
  );
}
