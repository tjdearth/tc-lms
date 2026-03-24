"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { DMC_BRANDS, brandFromEmail } from "./brands";
import { useSession } from "next-auth/react";

export type BrandMode = "tc" | string; // "tc" or a DMC brand name

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

const BRAND_LOGOS: Record<string, string> = {
  "Travel Collection": "/logos/tc.png",
  "Authenticus Italy": "/logos/authenticus-italy.png",
  "Unbox Spain & Portugal": "/logos/unbox-spain.png",
  "Truly Swahili": "/logos/truly-swahili.png",
  "Across Mexico": "/logos/across-mexico.png",
  "Kembali Indonesia": "/logos/kembali-indonesia.png",
  "Majlis Retreats": "/logos/majlis-retreats.png",
  "Crown Journey": "/logos/crown-journey.png",
  "Oshinobi Travel": "/logos/oshinobi-travel.png",
  "Essentially French": "/logos/essentially-french.png",
  "Elura Australia": "/logos/elura-australia.png",
  "Nira Thailand": "/logos/nira-thailand.png",
  "Sar Turkiye": "/logos/sar-turkiye.png",
  "Nostos Greece": "/logos/nostos-greece.png",
  "Vista Colombia": "/logos/vista-colombia.png",
  "Awaken Peru": "/logos/awaken-peru.png",
  "Experience Morocco": "/logos/experience-morocco.png",
};

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function isDarkColor(hex: string): boolean {
  const { r, g, b } = hexToRgb(hex);
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 < 0.45;
}

function darken(hex: string, factor: number): string {
  const { r, g, b } = hexToRgb(hex);
  const d = (v: number) => Math.max(0, Math.round(v * factor));
  return `#${d(r).toString(16).padStart(2, "0")}${d(g).toString(16).padStart(2, "0")}${d(b).toString(16).padStart(2, "0")}`;
}

const TC_THEME: BrandTheme = {
  mode: "tc",
  name: "Travel Collection",
  accent: "#27a28c",
  sidebarBg: "#1A2A3A",
  sidebarBorder: "#2A3F52",
  sidebarActiveBg: "#304256",
  sidebarIsDark: true,
  logo: "/logos/tc.png",
  countries: [],
};

function buildDmcTheme(brandName: string): BrandTheme {
  const brand = DMC_BRANDS[brandName];
  if (!brand) return TC_THEME;

  const hex = brand.hex;
  const dark = isDarkColor(hex);

  // Generate dark sidebar colors from the brand color
  const sidebarBg = dark ? darken(hex, 0.25) : darken(hex, 0.15);
  const sidebarBorder = dark ? darken(hex, 0.4) : darken(hex, 0.25);
  const sidebarActiveBg = dark ? darken(hex, 0.55) : darken(hex, 0.35);

  return {
    mode: brandName,
    name: brandName,
    accent: hex,
    sidebarBg,
    sidebarBorder,
    sidebarActiveBg,
    sidebarIsDark: true, // sidebar is always dark (darkened brand color)
    logo: BRAND_LOGOS[brandName] || "/logos/tc.png",
    countries: brand.countries,
  };
}

interface BrandContextType {
  brand: BrandTheme;
  userDmcBrand: string | null; // auto-detected from email
  setBrandMode: (mode: BrandMode) => void;
}

const BrandContext = createContext<BrandContextType>({
  brand: TC_THEME,
  userDmcBrand: null,
  setBrandMode: () => {},
});

export function BrandProvider({ children }: { children: ReactNode }) {
  const { data: session } = useSession();
  const [mode, setMode] = useState<BrandMode>("tc");

  // Auto-detect user's DMC brand from email
  const userDmcBrand = session?.user?.email
    ? brandFromEmail(session.user.email)
    : null;

  // On mount, restore from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("atlas-brand-mode");
      if (saved) setMode(saved);
    }
  }, []);

  const setBrandMode = (m: BrandMode) => {
    setMode(m);
    if (typeof window !== "undefined") {
      localStorage.setItem("atlas-brand-mode", m);
    }
  };

  const brand = mode === "tc" ? TC_THEME : buildDmcTheme(mode);

  return (
    <BrandContext.Provider value={{ brand, userDmcBrand, setBrandMode }}>
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  return useContext(BrandContext);
}
