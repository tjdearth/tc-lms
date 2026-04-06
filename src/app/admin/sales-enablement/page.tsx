"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import AppShell from "@/components/AppShell";
import { isAdmin } from "@/lib/admin";

/* ─────────────────── DATA ASSUMPTIONS (admin notes) ─────────────────── */
// Data starts from 1 Jan 2025 when all leads began being stored in Salesforce.
// Channel strategy is defined by Client Source + Agency:
//   KimKim = B2C where Agency contains "kimkim"
//   Zicasso = B2C where Agency contains "Zicasso"
//   WendyPerrin = B2C where Agency contains "Wendy Perrin"
//   B2B = all travel agencies (incl. Referral B2B)
//   Direct = customers finding us directly (incl. Referral Direct, Other)
//   DMC = combo trips with another TC brand (parent + child trip)
//   MICE = Incentive House category (separate)
// Any remaining B2C not matching above platforms → distribute to closest or treat as "Other B2C" (tiny numbers)
// Estimated Sale Price = advisor's estimate; Sale Price = contracted amount
// Proposals Count = number of SF proposals to confirm/lose
// Total Active Proposal Time = efficiency metric (unit TBC)
// Status: Confirmed or Lost (excl. Inquiry, Cancelled, Postponed — could add later)
// Trip Created Date = lead received; Sale Date = confirmed
// Loss Reason = dropdown (quality varies); Detailed Loss Reason = free text (quality varies)

/* ─────────────────── CHANNEL GROUPING ─────────────────── */
type ChannelGroup = "KimKim" | "Zicasso" | "WendyPerrin" | "B2B" | "Direct" | "DMC" | "MICE";

const CHANNEL_GROUP_LABELS: Record<ChannelGroup, string> = {
  "KimKim": "KimKim",
  "Zicasso": "Zicasso",
  "WendyPerrin": "Wendy Perrin",
  "B2B": "B2B (Travel Agencies)",
  "Direct": "Direct Enquiries",
  "DMC": "DMC Combo Trips",
  "MICE": "MICE / Incentive",
};

/* ─────────────────── DMC / SUBSIDIARY MAPPING ─────────────────── */
// Subsidiary → brand mapping (used when live data is connected):
// Morocco → Experience Morocco, Italy → Authenticus Italy, Spain → Unbox Spain & Portugal,
// France → Essentially French, Japan → Oshinobi Travel, Mexico → Across Mexico,
// East Africa → Truly Swahili, UK → Crown Journey, Indonesia → Kembali Asia,
// UAE → Majlis Retreats, Greece → Nostos Greece, Turkey → Sar Turkiye,
// Australia → Elura Australia, Colombia → Vista Colombia, Peru → Awaken Peru, Thailand → Nira Thailand

const DMC_COLORS: Record<string, string> = {
  "Experience Morocco": "#F56A23",
  "Authenticus Italy": "#C6B356",
  "Unbox Spain & Portugal": "#7C1137",
  "Essentially French": "#58392E",
  "Oshinobi Travel": "#E9395E",
  "Across Mexico": "#E56456",
  "Truly Swahili": "#4F9E2D",
  "Crown Journey": "#6D7581",
  "Kembali Asia": "#ADA263",
  "Majlis Retreats": "#B28A72",
  "Nostos Greece": "#0E1952",
  "Sar Turkiye": "#247F82",
  "Elura Australia": "#B04D32",
  "Vista Colombia": "#FEE9A8",
  "Awaken Peru": "#95AFA2",
  "Nira Thailand": "#636218",
};

/* ─────────────────── MOCK DATA: MOROCCO (Experience Morocco) ─────────────────── */
// Real aggregated numbers from SF export — 3,194 trips, 22 advisors

interface AdvisorData {
  name: string;
  totalTrips: number;
  confirmed: number;
  lost: number;
  conversionRate: number;
  totalSale: number;
  avgSale: number;
  avgProposals: number;
  avgProposalTime: number;
  channels: Record<ChannelGroup, { trips: number; won: number; lost: number; convRate: number; avgSale: number }>;
  lossReasons: { reason: string; count: number }[];
}

interface SubsidiaryData {
  subsidiary: string;
  brand: string;
  totalTrips: number;
  confirmed: number;
  lost: number;
  conversionRate: number;
  totalSale: number;
  avgSale: number;
  advisorCount: number;
  agencyCount: number;
  avgDaysToClose: number;
  avgNights: number;
  avgTravelers: number;
  channels: Record<ChannelGroup, { trips: number; won: number; lost: number; convRate: number; avgSale: number }>;
  lossReasons: { reason: string; count: number; pct: number }[];
  advisors: AdvisorData[];
}

const MOROCCO_ADVISORS: AdvisorData[] = [
  {
    name: "Hajar WANNAS",
    totalTrips: 327, confirmed: 156, lost: 171, conversionRate: 47.7, totalSale: 3900000, avgSale: 25000, avgProposals: 3.7, avgProposalTime: 2890,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "WendyPerrin": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "B2B": { trips: 324, won: 153, lost: 171, convRate: 47.2, avgSale: 25100 },
      "Direct": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "DMC": { trips: 3, won: 3, lost: 0, convRate: 100, avgSale: 18500 },
      "MICE": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
    },
    lossReasons: [{ reason: "Unresponsive agent", count: 52 }, { reason: "Budget/price mismatch", count: 38 }, { reason: "Won by competition", count: 31 }, { reason: "Other", count: 50 }],
  },
  {
    name: "Amal Amezargou",
    totalTrips: 411, confirmed: 172, lost: 239, conversionRate: 41.8, totalSale: 3885000, avgSale: 22588, avgProposals: 3.2, avgProposalTime: 2540,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 32, won: 11, lost: 21, convRate: 34.4, avgSale: 19500 },
      "WendyPerrin": { trips: 17, won: 6, lost: 11, convRate: 35.3, avgSale: 17800 },
      "B2B": { trips: 323, won: 142, lost: 181, convRate: 44.0, avgSale: 23200 },
      "Direct": { trips: 37, won: 11, lost: 26, convRate: 29.7, avgSale: 15200 },
      "DMC": { trips: 2, won: 2, lost: 0, convRate: 100, avgSale: 12000 },
      "MICE": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 68 }, { reason: "Budget/price mismatch", count: 45 }, { reason: "Other", count: 42 }, { reason: "Won by competition", count: 34 }],
  },
  {
    name: "Sara LAGHRIBI",
    totalTrips: 421, confirmed: 160, lost: 261, conversionRate: 38.0, totalSale: 3947000, avgSale: 24669, avgProposals: 3.0, avgProposalTime: 2710,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 40, won: 16, lost: 24, convRate: 40.0, avgSale: 21800 },
      "WendyPerrin": { trips: 23, won: 10, lost: 13, convRate: 43.5, avgSale: 20200 },
      "B2B": { trips: 353, won: 130, lost: 223, convRate: 36.8, avgSale: 25800 },
      "Direct": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "DMC": { trips: 2, won: 1, lost: 1, convRate: 50, avgSale: 14000 },
      "MICE": { trips: 3, won: 3, lost: 0, convRate: 100, avgSale: 32000 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 72 }, { reason: "Other", count: 55 }, { reason: "Budget/price mismatch", count: 42 }, { reason: "Picked another destination", count: 38 }],
  },
  {
    name: "Oumaima TOUMLIK",
    totalTrips: 141, confirmed: 52, lost: 89, conversionRate: 36.9, totalSale: 2076776, avgSale: 39938, avgProposals: 0.0, avgProposalTime: 0,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 1, won: 0, lost: 1, convRate: 0, avgSale: 0 },
      "WendyPerrin": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "B2B": { trips: 100, won: 42, lost: 58, convRate: 42.0, avgSale: 42100 },
      "Direct": { trips: 37, won: 10, lost: 27, convRate: 27.0, avgSale: 28400 },
      "DMC": { trips: 2, won: 0, lost: 2, convRate: 0, avgSale: 0 },
      "MICE": { trips: 1, won: 0, lost: 1, convRate: 0, avgSale: 0 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 28 }, { reason: "Other", count: 22 }, { reason: "Won by competition", count: 15 }, { reason: "Budget/price mismatch", count: 12 }],
  },
  {
    name: "Zainab TALMZI",
    totalTrips: 364, confirmed: 129, lost: 235, conversionRate: 35.4, totalSale: 2519499, avgSale: 19531, avgProposals: 3.9, avgProposalTime: 3120,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 1, won: 1, lost: 0, convRate: 100, avgSale: 15000 },
      "WendyPerrin": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "B2B": { trips: 295, won: 114, lost: 181, convRate: 38.6, avgSale: 20100 },
      "Direct": { trips: 58, won: 8, lost: 50, convRate: 13.8, avgSale: 12800 },
      "DMC": { trips: 3, won: 2, lost: 1, convRate: 66.7, avgSale: 22000 },
      "MICE": { trips: 7, won: 4, lost: 3, convRate: 57.1, avgSale: 45000 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 65 }, { reason: "Other", count: 52 }, { reason: "Unresponsive agent", count: 41 }, { reason: "Budget/price mismatch", count: 30 }],
  },
  {
    name: "Hiba EL IKLIL",
    totalTrips: 439, confirmed: 116, lost: 323, conversionRate: 26.4, totalSale: 1270316, avgSale: 10951, avgProposals: 2.3, avgProposalTime: 1810,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 35, won: 3, lost: 32, convRate: 8.6, avgSale: 9200 },
      "WendyPerrin": { trips: 15, won: 1, lost: 14, convRate: 6.7, avgSale: 7800 },
      "B2B": { trips: 103, won: 35, lost: 68, convRate: 34.0, avgSale: 14200 },
      "Direct": { trips: 280, won: 73, lost: 207, convRate: 26.1, avgSale: 9500 },
      "DMC": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "MICE": { trips: 6, won: 4, lost: 2, convRate: 66.7, avgSale: 18000 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 102 }, { reason: "Other", count: 78 }, { reason: "Unresponsive agent", count: 45 }, { reason: "Postponed", count: 38 }],
  },
  {
    name: "Salma EL KHLYFI",
    totalTrips: 438, confirmed: 142, lost: 296, conversionRate: 32.4, totalSale: 2291738, avgSale: 16139, avgProposals: 2.2, avgProposalTime: 1980,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 87, won: 17, lost: 70, convRate: 19.5, avgSale: 14800 },
      "WendyPerrin": { trips: 33, won: 9, lost: 24, convRate: 27.3, avgSale: 13100 },
      "B2B": { trips: 102, won: 42, lost: 60, convRate: 41.2, avgSale: 19800 },
      "Direct": { trips: 206, won: 68, lost: 138, convRate: 33.0, avgSale: 13900 },
      "DMC": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "MICE": { trips: 10, won: 6, lost: 4, convRate: 60.0, avgSale: 28000 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 88 }, { reason: "Other", count: 65 }, { reason: "Budget/price mismatch", count: 48 }, { reason: "Postponed", count: 35 }],
  },
  {
    name: "Loubna BOUANANI",
    totalTrips: 311, confirmed: 72, lost: 239, conversionRate: 23.2, totalSale: 876240, avgSale: 12170, avgProposals: 1.5, avgProposalTime: 980,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "WendyPerrin": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "B2B": { trips: 278, won: 68, lost: 210, convRate: 24.5, avgSale: 12400 },
      "Direct": { trips: 32, won: 3, lost: 29, convRate: 9.4, avgSale: 8200 },
      "DMC": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "MICE": { trips: 1, won: 1, lost: 0, convRate: 100, avgSale: 15000 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 72 }, { reason: "Unresponsive agent", count: 58 }, { reason: "Other", count: 42 }, { reason: "Budget/price mismatch", count: 28 }],
  },
];

// TC-wide channel benchmarks (global averages — B2C split into 3 platforms)
const TC_CHANNEL_BENCHMARKS: Record<ChannelGroup, { convRate: number; avgSale: number }> = {
  "KimKim": { convRate: 17.6, avgSale: 15337 },
  "Zicasso": { convRate: 19.3, avgSale: 19719 },
  "WendyPerrin": { convRate: 52.0, avgSale: 22384 },
  "B2B": { convRate: 39.6, avgSale: 18311 },
  "Direct": { convRate: 32.3, avgSale: 13085 },
  "DMC": { convRate: 40.2, avgSale: 9939 },
  "MICE": { convRate: 46.6, avgSale: 36696 },
};

// Admin calibration targets (editable)
const DEFAULT_CALIBRATION: Record<ChannelGroup, { targetConvRate: number; targetAvgSale: number; targetResponseHrs: number }> = {
  "KimKim": { targetConvRate: 10, targetAvgSale: 15000, targetResponseHrs: 4 },
  "Zicasso": { targetConvRate: 18, targetAvgSale: 18000, targetResponseHrs: 4 },
  "WendyPerrin": { targetConvRate: 40, targetAvgSale: 22000, targetResponseHrs: 4 },
  "B2B": { targetConvRate: 35, targetAvgSale: 20000, targetResponseHrs: 6 },
  "Direct": { targetConvRate: 50, targetAvgSale: 15000, targetResponseHrs: 12 },
  "DMC": { targetConvRate: 50, targetAvgSale: 15000, targetResponseHrs: 24 },
  "MICE": { targetConvRate: 45, targetAvgSale: 30000, targetResponseHrs: 24 },
};

// Morocco subsidiary aggregate
const MOROCCO_DATA: SubsidiaryData = {
  subsidiary: "Morocco",
  brand: "Experience Morocco",
  totalTrips: 3194,
  confirmed: 1142,
  lost: 2052,
  conversionRate: 35.8,
  totalSale: 23223739,
  avgSale: 20336,
  advisorCount: 22,
  agencyCount: 538,
  avgDaysToClose: 26,
  avgNights: 7.4,
  avgTravelers: 3.8,
  channels: {
    "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
    "Zicasso": { trips: 220, won: 50, lost: 170, convRate: 22.7, avgSale: 20764 },
    "WendyPerrin": { trips: 79, won: 34, lost: 45, convRate: 43.0, avgSale: 22384 },
    "B2B": { trips: 2097, won: 811, lost: 1286, convRate: 38.7, avgSale: 21362 },
    "Direct": { trips: 762, won: 213, lost: 549, convRate: 28.0, avgSale: 14832 },
    "DMC": { trips: 12, won: 8, lost: 4, convRate: 66.7, avgSale: 18200 },
    "MICE": { trips: 36, won: 35, lost: 1, convRate: 97.2, avgSale: 42000 },
  },
  lossReasons: [
    { reason: "Unresponsive end customer", count: 612, pct: 29.8 },
    { reason: "Other", count: 445, pct: 21.7 },
    { reason: "Unresponsive agent", count: 348, pct: 17.0 },
    { reason: "Budget/price mismatch", count: 248, pct: 12.1 },
    { reason: "Postponed", count: 142, pct: 6.9 },
    { reason: "Won by competition", count: 128, pct: 6.2 },
    { reason: "Picked another destination", count: 85, pct: 4.1 },
    { reason: "Cancelled", count: 44, pct: 2.1 },
  ],
  advisors: MOROCCO_ADVISORS,
};

// All subsidiaries summary for the global overview
const ALL_SUBSIDIARIES: { subsidiary: string; brand: string; trips: number; confirmed: number; convRate: number; totalSale: number; avgSale: number; advisors: number }[] = [
  { subsidiary: "Morocco", brand: "Experience Morocco", trips: 3194, confirmed: 1142, convRate: 35.8, totalSale: 23223739, avgSale: 20336, advisors: 22 },
  { subsidiary: "Italy", brand: "Authenticus Italy", trips: 1142, confirmed: 388, convRate: 34.0, totalSale: 7122893, avgSale: 18358, advisors: 8 },
  { subsidiary: "Spain", brand: "Unbox Spain & Portugal", trips: 618, confirmed: 228, convRate: 36.9, totalSale: 3011219, avgSale: 13208, advisors: 7 },
  { subsidiary: "France", brand: "Essentially French", trips: 360, confirmed: 129, convRate: 35.8, totalSale: 1910565, avgSale: 14810, advisors: 4 },
  { subsidiary: "Mexico", brand: "Across Mexico", trips: 338, confirmed: 134, convRate: 39.6, totalSale: 861001, avgSale: 6425, advisors: 6 },
  { subsidiary: "Japan", brand: "Oshinobi Travel", trips: 317, confirmed: 76, convRate: 24.0, totalSale: 1626974, avgSale: 21408, advisors: 8 },
  { subsidiary: "East Africa", brand: "Truly Swahili", trips: 306, confirmed: 69, convRate: 22.5, totalSale: 1493246, avgSale: 21641, advisors: 4 },
  { subsidiary: "UK", brand: "Crown Journey", trips: 240, confirmed: 95, convRate: 39.6, totalSale: 1472066, avgSale: 15495, advisors: 7 },
  { subsidiary: "Indonesia", brand: "Kembali Asia", trips: 57, confirmed: 28, convRate: 49.1, totalSale: 326626, avgSale: 11665, advisors: 6 },
  { subsidiary: "UAE", brand: "Majlis Retreats", trips: 45, confirmed: 13, convRate: 28.9, totalSale: 132924, avgSale: 10225, advisors: 2 },
  { subsidiary: "Greece", brand: "Nostos Greece", trips: 16, confirmed: 8, convRate: 50.0, totalSale: 99476, avgSale: 12435, advisors: 2 },
  { subsidiary: "Turkey", brand: "Sar Turkiye", trips: 8, confirmed: 4, convRate: 50.0, totalSale: 53844, avgSale: 13461, advisors: 1 },
  { subsidiary: "Australia", brand: "Elura Australia", trips: 7, confirmed: 3, convRate: 42.9, totalSale: 47489, avgSale: 15830, advisors: 1 },
  { subsidiary: "Peru", brand: "Awaken Peru", trips: 7, confirmed: 3, convRate: 42.9, totalSale: 16475, avgSale: 5492, advisors: 1 },
  { subsidiary: "Thailand", brand: "Nira Thailand", trips: 5, confirmed: 2, convRate: 40.0, totalSale: 17547, avgSale: 8774, advisors: 1 },
  { subsidiary: "Colombia", brand: "Vista Colombia", trips: 4, confirmed: 3, convRate: 75.0, totalSale: 5982, avgSale: 1994, advisors: 1 },
];

/* ─────────────────── HELPERS ─────────────────── */
function fmtCurrency(n: number): string {
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function fmtPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function convColor(rate: number, target: number): string {
  if (rate >= target) return "text-[#27a28c]";
  if (rate >= target * 0.85) return "text-amber-500";
  return "text-red-500";
}


/* ─────────────────── NAV ITEMS ─────────────────── */
type NavSection = "overview" | "dmc-detail" | "advisor" | "loss-analysis" | "calibration" | "notes";

const NAV_ITEMS: { id: NavSection; label: string; icon: string }[] = [
  { id: "overview", label: "Global Overview", icon: "globe" },
  { id: "dmc-detail", label: "DMC Performance", icon: "bar-chart" },
  { id: "advisor", label: "Advisor Scorecard", icon: "user" },
  { id: "loss-analysis", label: "Loss Analysis", icon: "x-circle" },
  { id: "calibration", label: "Calibration", icon: "sliders" },
  { id: "notes", label: "Data Notes", icon: "info" },
];

const ALL_CHANNELS: ChannelGroup[] = ["KimKim", "Zicasso", "WendyPerrin", "B2B", "Direct", "DMC", "MICE"];

/* ─────────────────── COMPONENT ─────────────────── */
export default function SalesEnablementPage() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const userIsAdmin = isAdmin(userEmail);

  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [panelWidth, setPanelWidth] = useState(260);
  const [calibration, setCalibration] = useState(DEFAULT_CALIBRATION);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(260);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = panelWidth;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, [panelWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const newW = startWidth.current + (e.clientX - startX.current);
      setPanelWidth(Math.max(200, Math.min(400, newW)));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  if (!userIsAdmin) {
    return (
      <AppShell>
        <div className="min-h-[60vh] flex items-center justify-center p-8">
          <div className="bg-white rounded-xl border border-[#E8ECF1] p-8 text-center max-w-md">
            <h2 className="text-lg font-semibold text-[#304256] mb-2">Access Restricted</h2>
            <p className="text-sm text-gray-500">Sales Enablement is available to administrators only.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  const navIcon = (id: string, active: boolean) => {
    const color = active ? "#27a28c" : "#6B7D8F";
    switch (id) {
      case "globe":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>;
      case "bar-chart":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>;
      case "user":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
      case "x-circle":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>;
      case "sliders":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"/><line x1="4" y1="10" x2="4" y2="3"/><line x1="12" y1="21" x2="12" y2="12"/><line x1="12" y1="8" x2="12" y2="3"/><line x1="20" y1="21" x2="20" y2="16"/><line x1="20" y1="12" x2="20" y2="3"/><line x1="1" y1="14" x2="7" y2="14"/><line x1="9" y1="8" x2="15" y2="8"/><line x1="17" y1="16" x2="23" y2="16"/></svg>;
      case "info":
        return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>;
      default:
        return null;
    }
  };

  /* ─────── RENDER: GLOBAL OVERVIEW ─────── */
  const renderOverview = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#304256] mb-1">Global Sales Overview</h2>
        <p className="text-sm text-gray-500">All destinations, Jan 2025 &ndash; present &middot; 6,664 trips across 16 subsidiaries</p>
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Trips", value: "6,664", sub: "Confirmed + Lost" },
          { label: "Overall Win Rate", value: "34.5%", sub: "2,325 won of 6,664" },
          { label: "Total Revenue", value: "$41.4M", sub: "Contracted sale price" },
          { label: "Avg Trip Value", value: "$17.8K", sub: "Per confirmed trip" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[#E8ECF1] p-4">
            <p className="text-2xl font-bold text-[#304256]">{s.value}</p>
            <p className="text-sm font-medium text-[#304256] mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Channel performance */}
      <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8ECF1]">
          <h3 className="font-semibold text-[#304256]">Channel Performance (TC-wide)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Channel</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Trips</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Won</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Win Rate</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Target</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Revenue</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Sale</th>
              </tr>
            </thead>
            <tbody>
              {(ALL_CHANNELS).map((ch) => {
                const b = TC_CHANNEL_BENCHMARKS[ch];
                const cal = calibration[ch];
                const trips = ch === "KimKim" ? 529 : ch === "Zicasso" ? 874 : ch === "WendyPerrin" ? 271 : ch === "B2B" ? 3899 : ch === "Direct" ? 866 : ch === "DMC" ? 127 : 58;
                const won = ch === "KimKim" ? 93 : ch === "Zicasso" ? 169 : ch === "WendyPerrin" ? 141 : ch === "B2B" ? 1553 : ch === "Direct" ? 283 : ch === "DMC" ? 51 : 27;
                return (
                  <tr key={ch} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3">
                      <span className="font-medium text-[#304256]">{CHANNEL_GROUP_LABELS[ch]}</span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{trips.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{won.toLocaleString()}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-semibold tabular-nums ${convColor(b.convRate, cal.targetConvRate)}`}>
                        {fmtPct(b.convRate)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-gray-400 tabular-nums">{fmtPct(cal.targetConvRate)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(b.avgSale * won)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(b.avgSale)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* DMC Ranking */}
      <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8ECF1]">
          <h3 className="font-semibold text-[#304256]">DMC Ranking by Volume</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">DMC</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Trips</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Win Rate</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Revenue</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Sale</th>
                <th className="text-right px-5 py-3 font-medium text-gray-500">Advisors</th>
              </tr>
            </thead>
            <tbody>
              {ALL_SUBSIDIARIES.map((s) => (
                <tr
                  key={s.subsidiary}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => {
                    if (s.subsidiary === "Morocco") {
                      setActiveSection("dmc-detail");
                    }
                  }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DMC_COLORS[s.brand] || "#304256" }} />
                      <span className="font-medium text-[#304256]">{s.brand}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-600">{s.trips.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-semibold tabular-nums ${s.convRate >= 35 ? "text-[#27a28c]" : s.convRate >= 28 ? "text-amber-500" : "text-red-500"}`}>
                      {fmtPct(s.convRate)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(s.totalSale)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(s.avgSale)}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-400">{s.advisors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ─────── RENDER: DMC DETAIL (Morocco) ─────── */
  const renderDmcDetail = () => {
    const d = MOROCCO_DATA;
    const brandColor = DMC_COLORS[d.brand] || "#304256";

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brandColor }} />
            <h2 className="text-xl font-bold text-[#304256]">{d.brand}</h2>
          </div>
          <p className="text-sm text-gray-500">{d.totalTrips.toLocaleString()} trips &middot; {d.advisorCount} advisors &middot; {d.agencyCount} agency partners</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Win Rate", value: fmtPct(d.conversionRate) },
            { label: "Revenue", value: fmtCurrency(d.totalSale) },
            { label: "Avg Sale", value: fmtCurrency(d.avgSale) },
            { label: "Avg Days to Close", value: `${d.avgDaysToClose}d` },
            { label: "Avg Trip", value: `${d.avgNights} nights / ${d.avgTravelers} pax` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E8ECF1] p-4">
              <p className="text-lg font-bold text-[#304256]">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Channel breakdown */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="font-semibold text-[#304256]">Channel Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Channel</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Trips</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Won</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Win Rate</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">vs Target</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">vs TC Avg</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Sale</th>
                </tr>
              </thead>
              <tbody>
                {(ALL_CHANNELS).filter(ch => d.channels[ch].trips > 0).map((ch) => {
                  const c = d.channels[ch];
                  const cal = calibration[ch];
                  const tcAvg = TC_CHANNEL_BENCHMARKS[ch];
                  const vsTarget = c.convRate - cal.targetConvRate;
                  const vsTc = c.convRate - tcAvg.convRate;
                  return (
                    <tr key={ch} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-[#304256]">{CHANNEL_GROUP_LABELS[ch]}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-gray-600">{c.trips.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-gray-600">{c.won.toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-semibold tabular-nums ${convColor(c.convRate, cal.targetConvRate)}`}>{fmtPct(c.convRate)}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-xs font-medium tabular-nums ${vsTarget >= 0 ? "text-[#27a28c]" : "text-red-500"}`}>
                          {vsTarget >= 0 ? "+" : ""}{vsTarget.toFixed(1)}pts
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-xs font-medium tabular-nums ${vsTc >= 0 ? "text-[#27a28c]" : "text-red-500"}`}>
                          {vsTc >= 0 ? "+" : ""}{vsTc.toFixed(1)}pts
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(c.avgSale)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Advisor ranking */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="font-semibold text-[#304256]">Advisor Performance</h3>
            <p className="text-xs text-gray-400 mt-0.5">Click an advisor for detailed channel-by-channel scorecard</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Advisor</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Trips</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Win Rate</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Sale</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Revenue</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Proposals</th>
                </tr>
              </thead>
              <tbody>
                {d.advisors.sort((a, b) => b.conversionRate - a.conversionRate).map((adv) => (
                  <tr
                    key={adv.name}
                    className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => { setSelectedAdvisor(adv.name); setActiveSection("advisor"); }}
                  >
                    <td className="px-5 py-3 font-medium text-[#304256]">{adv.name}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{adv.totalTrips}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-semibold tabular-nums ${adv.conversionRate >= d.conversionRate ? "text-[#27a28c]" : adv.conversionRate >= d.conversionRate * 0.85 ? "text-amber-500" : "text-red-500"}`}>
                        {fmtPct(adv.conversionRate)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(adv.avgSale)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(adv.totalSale)}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-400">{adv.avgProposals.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ─────── RENDER: ADVISOR SCORECARD ─────── */
  const renderAdvisor = () => {
    const adv = MOROCCO_DATA.advisors.find((a) => a.name === selectedAdvisor) || MOROCCO_DATA.advisors[0];
    const dmcAvg = MOROCCO_DATA;
    const brandColor = DMC_COLORS[dmcAvg.brand] || "#304256";

    return (
      <div className="space-y-6">
        <div>
          <button
            onClick={() => setActiveSection("dmc-detail")}
            className="text-xs text-[#27a28c] hover:underline mb-2 flex items-center gap-1"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
            Back to {dmcAvg.brand}
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: brandColor }}>
              {adv.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#304256]">{adv.name}</h2>
              <p className="text-sm text-gray-500">{dmcAvg.brand} &middot; {adv.totalTrips} total trips</p>
            </div>
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Win Rate", value: fmtPct(adv.conversionRate), vs: `DMC avg: ${fmtPct(dmcAvg.conversionRate)}`, good: adv.conversionRate >= dmcAvg.conversionRate },
            { label: "Avg Sale", value: fmtCurrency(adv.avgSale), vs: `DMC avg: ${fmtCurrency(dmcAvg.avgSale)}`, good: adv.avgSale >= dmcAvg.avgSale },
            { label: "Total Revenue", value: fmtCurrency(adv.totalSale), vs: `${adv.confirmed} confirmed trips`, good: true },
            { label: "Avg Proposals", value: adv.avgProposals.toFixed(1), vs: "Per trip", good: true },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E8ECF1] p-4">
              <p className={`text-lg font-bold ${s.good ? "text-[#304256]" : "text-amber-600"}`}>{s.value}</p>
              <p className="text-sm font-medium text-[#304256] mt-0.5">{s.label}</p>
              <p className="text-xs text-gray-400">{s.vs}</p>
            </div>
          ))}
        </div>

        {/* Channel-by-channel scorecard */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="font-semibold text-[#304256]">Channel-by-Channel Performance</h3>
            <p className="text-xs text-gray-400 mt-0.5">Compared against DMC average and admin-set targets</p>
          </div>
          <div className="space-y-0">
            {(ALL_CHANNELS).filter(ch => adv.channels[ch].trips > 0).map((ch) => {
              const c = adv.channels[ch];
              const dmcCh = dmcAvg.channels[ch];
              const cal = calibration[ch];
              const tcAvg = TC_CHANNEL_BENCHMARKS[ch];
              return (
                <div key={ch} className="px-5 py-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-[#304256]">{CHANNEL_GROUP_LABELS[ch]}</h4>
                    <span className="text-xs text-gray-400">{c.trips} trips</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Win Rate */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Win Rate</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-lg font-bold tabular-nums ${convColor(c.convRate, cal.targetConvRate)}`}>
                          {fmtPct(c.convRate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-400">DMC: {fmtPct(dmcCh.convRate)}</span>
                        <span className="text-[10px] text-gray-400">TC: {fmtPct(tcAvg.convRate)}</span>
                        <span className="text-[10px] text-gray-400">Target: {fmtPct(cal.targetConvRate)}</span>
                      </div>
                      {/* Visual bar */}
                      <div className="mt-2 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400 w-8">You</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${c.convRate >= cal.targetConvRate ? "bg-[#27a28c]" : c.convRate >= cal.targetConvRate * 0.85 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${Math.min(100, (c.convRate / 60) * 100)}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-gray-400 w-8">DMC</span>
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gray-300" style={{ width: `${Math.min(100, (dmcCh.convRate / 60) * 100)}%` }} />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Avg Sale */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Avg Sale Price</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-lg font-bold tabular-nums ${c.avgSale >= dmcCh.avgSale ? "text-[#304256]" : "text-amber-600"}`}>
                          {fmtCurrency(c.avgSale)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-[10px] text-gray-400">DMC: {fmtCurrency(dmcCh.avgSale)}</span>
                        <span className="text-[10px] text-gray-400">TC: {fmtCurrency(tcAvg.avgSale)}</span>
                      </div>
                    </div>
                    {/* Win/Loss */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wide text-gray-400 mb-1">Win / Loss</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-[#27a28c]">{c.won}</span>
                        <span className="text-xs text-gray-300">/</span>
                        <span className="text-sm font-semibold text-red-400">{c.lost}</span>
                      </div>
                      <div className="mt-2 h-2 bg-red-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#27a28c] rounded-full" style={{ width: `${c.trips > 0 ? (c.won / c.trips) * 100 : 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loss reasons for this advisor */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="font-semibold text-[#304256]">Top Loss Reasons</h3>
          </div>
          <div className="p-5">
            <div className="space-y-3">
              {adv.lossReasons.map((lr) => {
                const pct = adv.lost > 0 ? (lr.count / adv.lost) * 100 : 0;
                return (
                  <div key={lr.reason}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-[#304256]">{lr.reason}</span>
                      <span className="text-xs text-gray-400 tabular-nums">{lr.count} ({pct.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-red-300 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ─────── RENDER: LOSS ANALYSIS ─────── */
  const renderLossAnalysis = () => {
    const d = MOROCCO_DATA;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[#304256] mb-1">Loss Analysis</h2>
          <p className="text-sm text-gray-500">{d.brand} &middot; {d.lost.toLocaleString()} lost trips</p>
        </div>

        {/* Loss reason breakdown */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="font-semibold text-[#304256]">Loss Reasons</h3>
            <p className="text-xs text-gray-400 mt-0.5">Categorised from Salesforce dropdown (quality varies by advisor)</p>
          </div>
          <div className="p-5 space-y-4">
            {d.lossReasons.map((lr) => (
              <div key={lr.reason}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-[#304256]">{lr.reason}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-[#304256] tabular-nums">{lr.count}</span>
                    <span className="text-xs text-gray-400 tabular-nums w-12 text-right">{lr.pct}%</span>
                  </div>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${lr.pct}%`,
                      backgroundColor: lr.reason === "Unresponsive end customer" ? "#EF4444" :
                        lr.reason === "Budget/price mismatch" ? "#F59E0B" :
                        lr.reason === "Won by competition" ? "#8B5CF6" :
                        lr.reason === "Unresponsive agent" ? "#EC4899" :
                        lr.reason === "Picked another destination" ? "#3B82F6" :
                        "#9CA3AF"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insight callouts */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
            <h4 className="font-semibold text-amber-800 mb-2">Controllable Losses: 29.1%</h4>
            <p className="text-sm text-amber-700 leading-relaxed">
              <strong>Budget/price mismatch</strong> (12.1%) and <strong>Won by competition</strong> (6.2%) represent losses where we had an opportunity to win.
              Combined with <strong>Unresponsive agent</strong> (17.0%), nearly a third of losses are potentially addressable through faster response times and pricing flexibility.
            </p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-semibold text-blue-800 mb-2">Uncontrollable: 36.7%</h4>
            <p className="text-sm text-blue-700 leading-relaxed">
              <strong>Unresponsive end customer</strong> (29.8%) is the largest single category.
              Combined with <strong>Postponed</strong> (6.9%), over a third of losses are due to factors outside advisor control.
              The &ldquo;Other&rdquo; category (21.7%) needs better categorisation to surface actionable patterns.
            </p>
          </div>
        </div>

        {/* Per-advisor loss comparison */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="font-semibold text-[#304256]">Loss Patterns by Advisor</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Advisor</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Lost</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Top Reason</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">2nd Reason</th>
                </tr>
              </thead>
              <tbody>
                {d.advisors.sort((a, b) => b.lost - a.lost).map((adv) => (
                  <tr key={adv.name} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                    <td className="px-5 py-3 font-medium text-[#304256]">{adv.name}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{adv.lost}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">
                        {adv.lossReasons[0]?.reason} ({adv.lossReasons[0]?.count})
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                        {adv.lossReasons[1]?.reason} ({adv.lossReasons[1]?.count})
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  /* ─────── RENDER: CALIBRATION ─────── */
  const renderCalibration = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#304256] mb-1">Channel Calibration</h2>
        <p className="text-sm text-gray-500">Set expected win rates and targets per channel. These benchmarks are used to assess advisor performance across all DMCs.</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8ECF1] flex items-center justify-between">
          <h3 className="font-semibold text-[#304256]">TC Global Targets</h3>
          <span className="text-xs text-gray-400">Per-DMC overrides coming soon</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                <th className="text-left px-5 py-3 font-medium text-gray-500">Channel</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Target Win Rate</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Target Avg Sale</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Target Response (hrs)</th>
                <th className="text-center px-5 py-3 font-medium text-gray-500">Actual (TC-wide)</th>
              </tr>
            </thead>
            <tbody>
              {(ALL_CHANNELS).map((ch) => {
                const cal = calibration[ch];
                const actual = TC_CHANNEL_BENCHMARKS[ch];
                return (
                  <tr key={ch} className="border-b border-gray-100 last:border-b-0">
                    <td className="px-5 py-4 font-medium text-[#304256]">{CHANNEL_GROUP_LABELS[ch]}</td>
                    <td className="px-5 py-4 text-center">
                      <input
                        type="number"
                        value={cal.targetConvRate}
                        onChange={(e) => setCalibration((prev) => ({
                          ...prev,
                          [ch]: { ...prev[ch], targetConvRate: parseFloat(e.target.value) || 0 },
                        }))}
                        className="w-20 text-center px-2 py-1.5 border border-[#E8ECF1] rounded-lg text-sm focus:border-[#27a28c] outline-none"
                        step={1}
                      />
                      <span className="text-xs text-gray-400 ml-1">%</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="text-xs text-gray-400 mr-1">$</span>
                      <input
                        type="number"
                        value={cal.targetAvgSale}
                        onChange={(e) => setCalibration((prev) => ({
                          ...prev,
                          [ch]: { ...prev[ch], targetAvgSale: parseFloat(e.target.value) || 0 },
                        }))}
                        className="w-24 text-center px-2 py-1.5 border border-[#E8ECF1] rounded-lg text-sm focus:border-[#27a28c] outline-none"
                        step={500}
                      />
                    </td>
                    <td className="px-5 py-4 text-center">
                      <input
                        type="number"
                        value={cal.targetResponseHrs}
                        onChange={(e) => setCalibration((prev) => ({
                          ...prev,
                          [ch]: { ...prev[ch], targetResponseHrs: parseFloat(e.target.value) || 0 },
                        }))}
                        className="w-20 text-center px-2 py-1.5 border border-[#E8ECF1] rounded-lg text-sm focus:border-[#27a28c] outline-none"
                        step={1}
                      />
                      <span className="text-xs text-gray-400 ml-1">hrs</span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`font-semibold tabular-nums ${convColor(actual.convRate, cal.targetConvRate)}`}>
                        {fmtPct(actual.convRate)}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">{fmtCurrency(actual.avgSale)}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Channel definitions */}
      <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E8ECF1]">
          <h3 className="font-semibold text-[#304256]">Channel Definitions</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { ch: "KimKim", desc: "B2C platform connecting end travellers to local experts. Matched by Agency containing &ldquo;kimkim&rdquo;. Operates in most destinations but not Morocco." },
            { ch: "Zicasso", desc: "B2C luxury travel platform matching travellers with specialists. Matched by Agency containing &ldquo;Zicasso&rdquo;. Our highest-volume B2C platform." },
            { ch: "Wendy Perrin", desc: "B2C platform curated by travel journalist Wendy Perrin. Matched by Agency containing &ldquo;Wendy Perrin&rdquo;. Highest win rate of all B2C channels." },
            { ch: "B2B", desc: "All travel agencies we work with, including Referral B2B. Our largest channel by volume." },
            { ch: "Direct", desc: "Customers finding us directly with no intermediary. Includes Referral Direct and Other sources." },
            { ch: "DMC", desc: "Combo trips with another TC brand involving parent + child trip for multi-destination itineraries." },
            { ch: "MICE", desc: "Meetings, Incentives, Conferences & Events. Managed through Incentive House partners." },
          ].map((item) => (
            <div key={item.ch} className="flex gap-3">
              <span className="text-xs font-semibold text-[#27a28c] w-24 flex-shrink-0 pt-0.5">{item.ch}</span>
              <p className="text-sm text-gray-600" dangerouslySetInnerHTML={{ __html: item.desc }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  /* ─────── RENDER: DATA NOTES ─────── */
  const renderNotes = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#304256] mb-1">Data Notes & Assumptions</h2>
        <p className="text-sm text-gray-500">Reference for how this data is sourced and interpreted</p>
      </div>

      <div className="bg-white rounded-xl border border-[#E8ECF1] p-6 space-y-5">
        {[
          { title: "Data Period", text: "Starts 1 January 2025 — the date Travel Collection began storing all leads in Salesforce." },
          { title: "Source", text: "Salesforce via Google Sheet sync (AppScript → Supabase). Data is refreshed daily." },
          { title: "Status Filter", text: "Only Confirmed and Lost trips are included. Inquiry, Cancelled, and Postponed are excluded (could be added later)." },
          { title: "Channel Strategy", text: "Defined by Client Source + Agency fields. B2C is split into three platforms: KimKim (Agency contains &ldquo;kimkim&rdquo;), Zicasso (Agency contains &ldquo;Zicasso&rdquo;), and Wendy Perrin (Agency contains &ldquo;Wendy Perrin&rdquo;). Remaining channels: B2B, Direct, DMC, and MICE." },
          { title: "Pricing Fields", text: "Estimated Sale Price is the advisor's pre-quote estimate. Sale Price is the final contracted amount. Revenue calculations use Sale Price where available." },
          { title: "Proposals Count", text: "Number of formal SF proposals created per trip. Won trips average 4.8 proposals vs 1.6 for lost — higher effort correlates with winning." },
          { title: "Total Active Proposal Time", text: "An efficiency metric representing time spent creating proposals. Unit needs confirmation — currently treated as minutes." },
          { title: "Loss Reason Quality", text: "Dropdown selection quality varies by advisor. &ldquo;Other&rdquo; is overused (21.7%). Detailed Loss Reason is free-text and inconsistently filled." },
          { title: "DMC Combo Trips", text: "When two TC brands collaborate on a multi-destination trip. Counted under the primary DMC's stats." },
          { title: "New DMCs", text: "Several subsidiaries (Colombia, Peru, Thailand, Greece, Turkey, Australia) have very low trip volumes (<20) as they are newer or smaller operations. Performance data should be interpreted with caution." },
        ].map((note) => (
          <div key={note.title}>
            <h4 className="text-sm font-semibold text-[#304256] mb-1">{note.title}</h4>
            <p className="text-sm text-gray-500 leading-relaxed" dangerouslySetInnerHTML={{ __html: note.text }} />
          </div>
        ))}
      </div>
    </div>
  );

  /* ─────── MAIN RENDER ─────── */
  const renderContent = () => {
    switch (activeSection) {
      case "overview": return renderOverview();
      case "dmc-detail": return renderDmcDetail();
      case "advisor": return renderAdvisor();
      case "loss-analysis": return renderLossAnalysis();
      case "calibration": return renderCalibration();
      case "notes": return renderNotes();
      default: return renderOverview();
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen">
        <div className="flex flex-1 min-h-0">
          {/* Left nav panel */}
          <div
            className="flex-shrink-0 border-r border-gray-200 bg-white flex flex-col"
            style={{ width: panelWidth }}
          >
            <div className="px-4 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
                <h1 className="text-sm font-bold text-[#304256]">Sales Enablement</h1>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Admin only &middot; Data from Jan 2025</p>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {NAV_ITEMS.map((item) => {
                const active = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[13px] transition-colors ${
                      active
                        ? "bg-[#27a28c]/10 text-[#27a28c] font-semibold"
                        : "text-gray-600 hover:bg-gray-50 hover:text-[#304256]"
                    }`}
                  >
                    {navIcon(item.icon, active)}
                    {item.label}
                  </button>
                );
              })}
            </nav>

            {/* Dataset summary */}
            <div className="px-4 py-3 border-t border-gray-200 bg-gray-50/50">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Total trips</span>
                  <span className="text-[#304256] font-medium">6,664</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Advisors</span>
                  <span className="text-[#304256] font-medium">76</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Subsidiaries</span>
                  <span className="text-[#304256] font-medium">16</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-gray-400">Agency partners</span>
                  <span className="text-[#304256] font-medium">737</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resize handle */}
          <div
            className="w-1 cursor-col-resize hover:bg-[#27a28c]/20 active:bg-[#27a28c]/30 transition-colors flex-shrink-0"
            onMouseDown={onMouseDown}
          />

          {/* Content area */}
          <div className="flex-1 overflow-y-auto bg-[#f9fafb] p-6">
            <div className="max-w-[1000px]">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
