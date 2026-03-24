"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type BrandMode = "tc" | "unbox-spain";

export interface BrandTheme {
  mode: BrandMode;
  name: string;
  accent: string;
  sidebarBg: string;
  sidebarBorder: string;
  sidebarActiveBg: string;
  sidebarIsDark: boolean;
  logo: string;
  countries: string[];
}

const THEMES: Record<BrandMode, BrandTheme> = {
  tc: {
    mode: "tc",
    name: "Travel Collection",
    accent: "#27a28c",
    sidebarBg: "#1A2A3A",
    sidebarBorder: "#2A3F52",
    sidebarActiveBg: "#304256",
    sidebarIsDark: true,
    logo: "/logos/tc.png",
    countries: [],
  },
  "unbox-spain": {
    mode: "unbox-spain",
    name: "Unbox Spain & Portugal",
    accent: "#7C1137",
    sidebarBg: "#2A1019",
    sidebarBorder: "#4A1E2E",
    sidebarActiveBg: "#5A2338",
    sidebarIsDark: true,
    logo: "/logos/unbox-spain.png",
    countries: ["Spain", "Portugal"],
  },
};

interface BrandContextType {
  brand: BrandTheme;
  setBrandMode: (mode: BrandMode) => void;
}

const BrandContext = createContext<BrandContextType>({
  brand: THEMES.tc,
  setBrandMode: () => {},
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<BrandMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("atlas-brand-mode") as BrandMode) || "tc";
    }
    return "tc";
  });

  const setBrandMode = (m: BrandMode) => {
    setMode(m);
    if (typeof window !== "undefined") {
      localStorage.setItem("atlas-brand-mode", m);
    }
  };

  return (
    <BrandContext.Provider value={{ brand: THEMES[mode], setBrandMode }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
