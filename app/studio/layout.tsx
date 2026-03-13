import { PenTool, Home } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex flex-col min-h-[100dvh]"
      style={{
        background: "linear-gradient(180deg, #090614 0%, #120b22 100%)",
        color: "white",
      }}
    >
      {/* Studio Header */}
      <header
        className="sticky top-0 z-40 flex items-center justify-between px-6 py-4"
        style={{
          background: "rgba(9, 6, 20, 0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(196,181,253,0.1)",
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg"
            style={{
              background: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
            }}
          >
            <PenTool size={16} color="white" />
          </div>
          <h1 className="text-lg font-bold tracking-wide" style={{ fontFamily: "'Georgia', serif" }}>
            Hearthlight <span className="font-sans text-xs font-normal opacity-60 uppercase ml-1">Studio</span>
          </h1>
        </div>
        
        <Link 
          href="/"
          className="flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full transition-colors hover:bg-white/5"
          style={{ color: "rgba(196,181,253,0.8)" }}
        >
          <Home size={14} />
          Reader App
        </Link>
      </header>

      {/* Main Studio Content Container */}
      <main className="flex-1 flex flex-col w-full max-w-6xl mx-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
