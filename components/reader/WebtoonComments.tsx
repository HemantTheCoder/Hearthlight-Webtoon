"use client";

import { motion } from "framer-motion";
import { ThumbsUp, MessageCircle, MoreHorizontal } from "lucide-react";

const MOCK_COMMENTS = [
  {
    id: "1",
    user: "Lumine_Starlight",
    text: "The art style in this chapter is absolutely breathtaking! The rooftop scene felt so intimate.",
    likes: 242,
    time: "2h ago",
    avatar: "🌙",
    color: "#7c3aed"
  },
  {
    id: "2",
    user: "CityDreamer",
    text: "Wait, the bookmark? How does she know his name?! The cliffhanger is killing me! 😭",
    likes: 185,
    time: "5h ago",
    avatar: "☕",
    color: "#ec4899"
  },
  {
    id: "3",
    user: "SlowBurnLover",
    text: "That look in Eleanor's eyes... and the way the panels dragged out the tension. 10/10.",
    likes: 94,
    time: "12h ago",
    avatar: "🌸",
    color: "#10b981"
  }
];

export default function WebtoonComments() {
  return (
    <div className="px-5 py-10 mt-10 border-t border-white/5" style={{ background: "rgba(15,10,30,0.3)" }}>
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "white", fontFamily: "'Georgia', serif" }}>
          Comments <span className="text-sm font-normal text-white/40">(1,240)</span>
        </h3>
        <button className="text-xs font-semibold text-purple-400">View All</button>
      </div>

      <div className="flex flex-col gap-6">
        {MOCK_COMMENTS.map((comment, i) => (
          <motion.div 
            key={comment.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-4"
          >
            <div 
              className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-lg border border-white/10"
              style={{ background: `linear-gradient(135deg, ${comment.color}, #000)` }}
            >
              {comment.avatar}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-bold text-white/90">{comment.user}</span>
                <span className="text-[10px] text-white/30 uppercase tracking-tighter">{comment.time}</span>
              </div>
              
              <p className="text-sm leading-relaxed text-white/70 mb-3 italic font-light">
                "{comment.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-400 transition-colors">
                  <ThumbsUp size={12} />
                  {comment.likes}
                </button>
                <button className="flex items-center gap-1.5 text-xs text-white/40 hover:text-purple-400 transition-colors">
                  <MessageCircle size={12} />
                  Reply
                </button>
                <button className="ml-auto text-white/20">
                  <MoreHorizontal size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <button 
        className="w-full mt-10 py-4 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all border border-purple-500/30 hover:bg-purple-500/10"
        style={{ 
          background: "rgba(124, 58, 237, 0.05)",
          color: "#c4b5fd"
        }}
      >
        <MessageCircle size={16} />
        Add a comment...
      </button>
    </div>
  );
}
