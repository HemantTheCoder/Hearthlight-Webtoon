"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Search, Bell, Home, Library, Compass, User, LogOut, PenTool } from "lucide-react";
import StoryCard from "@/components/home/StoryCard";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/lib/AuthContext";
import { STORIES } from "@/data/stories";
import { useStudioStore } from "@/lib/useStudioStore";
import { Story } from "@/types/story";

const GENRES = ["All", "Romance", "Rom-com", "Drama", "Slice of Life", "Fantasy", "Indie"];

const ROOM_TYPES = [
  { name: "Late Night Romance", emoji: "🌙", count: 12, gradient: "linear-gradient(135deg, #1a1033, #4c1d95)" },
  { name: "Cozy Café", emoji: "☕", count: 8, gradient: "linear-gradient(135deg, #2d1b1b, #92400e)" },
  { name: "First Love", emoji: "🌸", count: 15, gradient: "linear-gradient(135deg, #1f1035, #be185d)" },
  { name: "Slow Burn", emoji: "🕯️", count: 6, gradient: "linear-gradient(135deg, #0f1a2e, #1e40af)" },
];

const NAV_ITEMS = [
  { id: "home", label: "Home", Icon: Home },
  { id: "library", label: "Library", Icon: Library },
  { id: "discover", label: "Discover", Icon: Compass },
  { id: "profile", label: "Profile", Icon: User },
];

export default function HomePage() {
  const [activeGenre, setActiveGenre] = useState("All");
  const [activeTab, setActiveTab] = useState("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const { drafts } = useStudioStore();

  const publishedIndieStories: Story[] = drafts
    .filter(d => d.status === "published")
    .map(d => ({
       id: d.id,
       title: d.title,
       author: d.author || "Community Creator",
       coverUrl: d.coverImage || "",
       genre: ["Indie", ...(d.genre || [])],
       synopsis: d.synopsis,
       tags: d.tags || [],
       isComplete: d.chapters.length > 0,
       characters: [],
       chapters: [] // Only need basic metadata for StoryCard
    }));

  const combinedStories = [...STORIES, ...publishedIndieStories];

  const featured = combinedStories.filter((s) => s.isFeatured || drafts.some(d => d.id === s.id)); // Feature indies to show them off
  const newStories = combinedStories.filter((s) => s.isNew);
  
  const filtered =
    activeGenre === "All"
      ? combinedStories
      : activeGenre === "Indie"
      ? publishedIndieStories
      : combinedStories.filter((s) => {
          if (!s.genre) return false;
          if (Array.isArray(s.genre)) {
            return s.genre.some((g) => String(g).toLowerCase().includes(activeGenre.toLowerCase()));
          }
          return String(s.genre).toLowerCase().includes(activeGenre.toLowerCase());
        });

  return (
    <div
      className="flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0f0a1e 0%, #1a0f35 40%, #0f0a1e 100%)",
        maxWidth: "430px",
        margin: "0 auto",
        minHeight: "100dvh",
      }}
    >
      {/* Header */}
      <div className="px-5 pt-12 pb-4">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{
                fontFamily: "'Georgia', serif",
                background: "linear-gradient(135deg, #e2d9f3, #c4b5fd, #f9a8d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Hearthlight
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "rgba(196,181,253,0.6)" }}>
              Your story sanctuary
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{
                background: "rgba(196,181,253,0.1)",
                border: "1px solid rgba(196,181,253,0.15)",
              }}
            >
              <Bell size={16} style={{ color: "rgba(196,181,253,0.8)" }} />
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #f472b6)" }}
            >
              <User size={15} style={{ color: "white" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-5 mb-5">
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{
            background: "rgba(196,181,253,0.08)",
            border: "1px solid rgba(196,181,253,0.15)",
          }}
        >
          <Search size={15} style={{ color: "rgba(196,181,253,0.5)" }} />
          <span className="text-sm" style={{ color: "rgba(196,181,253,0.4)" }}>
            Search stories, authors...
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Featured */}
        {featured.length > 0 && (
          <div className="px-5 mb-6">
            <SectionHeader title="Featured" icon="✨" />
            <StoryCard story={featured[0]} index={0} variant="large" />
          </div>
        )}

        {/* Genre filters */}
        <div className="mb-5">
          <div className="flex gap-2 overflow-x-auto px-5 pb-1 no-scrollbar">
            {GENRES.map((genre) => (
              <motion.button
                key={genre}
                onClick={() => setActiveGenre(genre)}
                whileTap={{ scale: 0.97 }}
                className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background:
                    activeGenre === genre
                      ? "linear-gradient(135deg, #7c3aed, #a855f7)"
                      : "rgba(196,181,253,0.08)",
                  color: activeGenre === genre ? "white" : "rgba(196,181,253,0.7)",
                  border:
                    activeGenre === genre
                      ? "none"
                      : "1px solid rgba(196,181,253,0.15)",
                }}
              >
                {genre}
              </motion.button>
            ))}
          </div>
        </div>

        {/* New Stories */}
        {newStories.length > 0 && activeGenre === "All" && (
          <div className="mb-6">
            <div className="px-5">
              <SectionHeader title="New Stories" icon="🌸" />
            </div>
            <div className="flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
              {newStories.map((story, i) => (
                <StoryCard key={story.id} story={story} index={i} variant="medium" />
              ))}
            </div>
          </div>
        )}

        {/* Story Rooms */}
        {activeGenre === "All" && (
          <div className="px-5 mb-6">
            <SectionHeader title="Story Rooms" icon="🏮" />
            <div className="grid grid-cols-2 gap-3">
              {ROOM_TYPES.map((room) => (
                <motion.button
                  key={room.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative rounded-2xl overflow-hidden text-left"
                  style={{ height: "90px", background: room.gradient }}
                >
                  <div className="absolute inset-0 p-3 flex flex-col justify-end">
                    <span className="text-xl mb-1">{room.emoji}</span>
                    <p
                      className="text-xs font-semibold text-white"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {room.name}
                    </p>
                    <p className="text-white/50" style={{ fontSize: "10px" }}>
                      {room.count} stories
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* All / Filtered Stories */}
        <div className="mb-6">
          <div className="px-5">
            <SectionHeader
              title={activeGenre === "All" ? "All Stories" : activeGenre}
              icon="📖"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto px-5 pb-2 no-scrollbar">
            {filtered.map((story, i) => (
              <StoryCard key={story.id} story={story} index={i} variant="medium" />
            ))}
          </div>
        </div>

        {/* Continue reading banner */}
        <div className="px-5 mb-6">
          <SectionHeader title="Continue Reading" icon="🌙" />
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(244,114,182,0.1))",
              border: "1px solid rgba(196,181,253,0.2)",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7c3aed, #f472b6)" }}
            >
              <span className="text-xl">☕</span>
            </div>
            <div>
              <p
                className="text-sm font-semibold"
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontFamily: "'Georgia', serif",
                }}
              >
                Starlight Café
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(196,181,253,0.65)" }}>
                Ch. 1 · The Rooftop at Night
              </p>
            </div>
            <div className="ml-auto">
              <div
                className="px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a855f7)",
                  color: "white",
                }}
              >
                Read
              </div>
            </div>
          </motion.div>
        </div>

        {/* Made by Hemant Kumar */}
        <div className="px-5 pb-4 pt-2">
          <div
            className="rounded-2xl px-4 py-3 flex items-center justify-between"
            style={{
              background: "rgba(196,181,253,0.05)",
              border: "1px solid rgba(196,181,253,0.1)",
            }}
          >
            <div>
              <p className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>
                Platform developed by
              </p>
              <p className="text-sm font-semibold" style={{ color: "rgba(196,181,253,0.85)", fontFamily: "'Georgia', serif" }}>
                Hemant Kumar
              </p>
            </div>
            <a
              href="https://www.linkedin.com/in/hemantkumar2430/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: "linear-gradient(135deg, #0a66c2, #0e8ee9)",
                color: "white",
                textDecoration: "none",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full"
        style={{
          maxWidth: "430px",
          background: "rgba(15,10,30,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(196,181,253,0.12)",
        }}
      >
        <div className="flex items-center justify-around px-6 py-3 pb-7">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "profile" && !user) {
                  setIsAuthModalOpen(true);
                  return;
                }
                setActiveTab(item.id);
              }}
              className="flex flex-col items-center gap-1 relative"
            >
              <item.Icon
                size={20}
                style={{
                  color: activeTab === item.id ? "#a78bfa" : "rgba(196,181,253,0.35)",
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  color: activeTab === item.id ? "#a78bfa" : "rgba(196,181,253,0.35)",
                }}
              >
                {item.label}
              </span>
              {activeTab === item.id && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full"
                  style={{ background: "#a78bfa" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Render Profile View overlay if activeTab === "profile" and user exists */}
      <AnimatePresence>
        {activeTab === "profile" && user && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-40 px-5 pt-32 h-[100dvh]"
            style={{
              background: "#0f0a1e",
              maxWidth: "430px",
              margin: "0 auto",
            }}
          >
            <div className="flex flex-col items-center justify-center pt-20">
              <div 
                className="w-24 h-24 rounded-full mb-4 flex justify-center items-center text-3xl font-bold relative"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #ec4899)",
                  color: "white"
                }}
              >
                {user.username.charAt(0).toUpperCase()}
                <div className="absolute -bottom-1 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-white/20 bg-black/60 backdrop-blur-md">
                  {user.role}
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-1" style={{ color: "white", fontFamily: "'Georgia', serif" }}>
                {user.username}
              </h2>
              <p className="text-sm mb-6" style={{ color: "rgba(196,181,253,0.6)" }}>
                Member since {new Date(user.joinedDate).toLocaleDateString()}
              </p>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 w-full mb-8">
                 <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                    <p className="text-xs text-white/30 uppercase font-bold tracking-tighter mb-1">Stories Read</p>
                    <p className="text-xl font-bold text-white">12</p>
                 </div>
                 <div className="bg-white/5 border border-white/5 rounded-2xl p-4 text-center">
                    <p className="text-xs text-white/30 uppercase font-bold tracking-tighter mb-1">Time Spent</p>
                    <p className="text-xl font-bold text-white">4.5h</p>
                 </div>
              </div>

              <div className="flex flex-col gap-3 w-full max-w-[200px] mb-8">
                {user.role === "artist" && (
                  <Link
                    href="/studio"
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-shadow"
                    style={{
                      background: "linear-gradient(135deg, #9333ea 0%, #c084fc 100%)",
                      color: "white",
                      boxShadow: "0 8px 25px rgba(168, 85, 247, 0.25)",
                    }}
                  >
                    <PenTool size={16} />
                    Creator Studio
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setActiveTab("home");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-colors"
                  style={{
                    background: "rgba(244,114,182,0.1)",
                    color: "#f472b6",
                    border: "1px solid rgba(244,114,182,0.2)"
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span>{icon}</span>
      <h2
        className="text-sm font-semibold"
        style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Georgia', serif" }}
      >
        {title}
      </h2>
    </div>
  );
}
