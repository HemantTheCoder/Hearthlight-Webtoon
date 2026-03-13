"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login/register by just setting the username
    const displayUser = isLogin ? (email.split("@")[0] || "Reader") : username;
    login(displayUser);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl"
            style={{
              background: "linear-gradient(180deg, #1e1533 0%, #171026 100%)",
              border: "1px solid rgba(196,181,253,0.15)",
            }}
          >
            {/* Header Art / Glow */}
            <div
              className="absolute top-0 left-0 right-0 h-32 opacity-30 pointer-events-none"
              style={{
                background: "radial-gradient(circle at 50% -20%, #a855f7 0%, transparent 70%)",
              }}
            />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <X size={16} style={{ color: "rgba(255,255,255,0.6)" }} />
            </button>

            <div className="p-8 pt-10">
              <h2
                className="text-2xl font-bold mb-2 text-center"
                style={{ color: "#f3e8ff", fontFamily: "'Georgia', serif" }}
              >
                {isLogin ? "Welcome Back" : "Begin Your Journey"}
              </h2>
              <p
                className="text-center text-sm mb-8"
                style={{ color: "rgba(196,181,253,0.6)" }}
              >
                {isLogin
                  ? "Sign in to save your story progress"
                  : "Create an account to unlock more stories"}
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {!isLogin && (
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(196,181,253,0.4)" }}
                    />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required={!isLogin}
                      className="w-full bg-black/20 border outline-none px-12 py-3.5 text-sm rounded-2xl transition-colors"
                      style={{
                        borderColor: "rgba(196,181,253,0.1)",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(196,181,253,0.4)" }}
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/20 border outline-none px-12 py-3.5 text-sm rounded-2xl transition-colors focus:border-purple-400/50"
                    style={{
                      borderColor: "rgba(196,181,253,0.1)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "rgba(196,181,253,0.4)" }}
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-black/20 border outline-none px-12 py-3.5 text-sm rounded-2xl transition-colors focus:border-purple-400/50"
                    style={{
                      borderColor: "rgba(196,181,253,0.1)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full mt-4 flex items-center justify-center font-semibold rounded-2xl py-3.5 text-sm transition-shadow"
                  style={{
                    background: "linear-gradient(135deg, #9333ea 0%, #c084fc 100%)",
                    color: "white",
                    boxShadow: "0 8px 25px rgba(168, 85, 247, 0.25)",
                  }}
                >
                  {isLogin ? "Sign In" : "Register Account"}
                </motion.button>
              </form>

              <div className="mt-6 flex flex-col items-center gap-2">
                <p className="text-xs" style={{ color: "rgba(196,181,253,0.5)" }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                </p>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: "#c4b5fd" }}
                >
                  {isLogin ? "Create an account" : "Sign in instead"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
