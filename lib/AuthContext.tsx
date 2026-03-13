"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface UserProfile {
  username: string;
  joinedDate: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);

  // Simple mock persistence using localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("hearthlight_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const login = (username: string) => {
    const newUser = {
      username,
      joinedDate: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem("hearthlight_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hearthlight_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
