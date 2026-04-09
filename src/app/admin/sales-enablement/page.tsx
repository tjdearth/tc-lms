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

/* ─────────────────── MOCK DATA: ITALY (Authenticus Italy) ─────────────────── */
// Real aggregated numbers from SF export — 1,142 trips, 8 advisors

const ITALY_ADVISORS: AdvisorData[] = [
  {
    name: "Elisa Sciabica",
    totalTrips: 322, confirmed: 100, lost: 222, conversionRate: 31.1, totalSale: 1833763, avgSale: 18338, avgProposals: 2.1, avgProposalTime: 1238,
    channels: {
      "KimKim": { trips: 84, won: 24, lost: 60, convRate: 28.6, avgSale: 13415 },
      "Zicasso": { trips: 156, won: 29, lost: 127, convRate: 18.6, avgSale: 21411 },
      "WendyPerrin": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "B2B": { trips: 69, won: 40, lost: 29, convRate: 58.0, avgSale: 19404 },
      "Direct": { trips: 7, won: 5, lost: 2, convRate: 71.4, avgSale: 17621 },
      "DMC": { trips: 1, won: 1, lost: 0, convRate: 100, avgSale: 13264 },
      "MICE": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 100 }, { reason: "Cancelled", count: 27 }, { reason: "Other", count: 26 }, { reason: "Won by competition", count: 20 }],
  },
  {
    name: "Eleonora Arrigoni",
    totalTrips: 315, confirmed: 113, lost: 202, conversionRate: 35.9, totalSale: 1988193, avgSale: 17595, avgProposals: 2.9, avgProposalTime: 1298,
    channels: {
      "KimKim": { trips: 84, won: 17, lost: 67, convRate: 20.2, avgSale: 10987 },
      "Zicasso": { trips: 1, won: 1, lost: 0, convRate: 100, avgSale: 2688 },
      "WendyPerrin": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "B2B": { trips: 220, won: 93, lost: 127, convRate: 42.3, avgSale: 19295 },
      "Direct": { trips: 8, won: 1, lost: 7, convRate: 12.5, avgSale: 1010 },
      "DMC": { trips: 1, won: 0, lost: 1, convRate: 0, avgSale: 0 },
      "MICE": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
    },
    lossReasons: [{ reason: "Other", count: 54 }, { reason: "Unresponsive end customer", count: 53 }, { reason: "Unresponsive agent", count: 34 }, { reason: "Budget/price mismatch", count: 22 }],
  },
  {
    name: "Martina Venturi",
    totalTrips: 206, confirmed: 66, lost: 140, conversionRate: 32.0, totalSale: 1338829, avgSale: 20285, avgProposals: 2.7, avgProposalTime: 449,
    channels: {
      "KimKim": { trips: 72, won: 10, lost: 62, convRate: 13.9, avgSale: 14057 },
      "Zicasso": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "WendyPerrin": { trips: 60, won: 30, lost: 30, convRate: 50.0, avgSale: 22799 },
      "B2B": { trips: 64, won: 20, lost: 44, convRate: 31.2, avgSale: 23472 },
      "Direct": { trips: 10, won: 6, lost: 4, convRate: 60.0, avgSale: 7476 },
      "DMC": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "MICE": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
    },
    lossReasons: [{ reason: "Unresponsive end customer", count: 54 }, { reason: "Other", count: 25 }, { reason: "Budget/price mismatch", count: 23 }, { reason: "Picked another destination", count: 17 }],
  },
  {
    name: "Giulia Catalano",
    totalTrips: 197, confirmed: 75, lost: 122, conversionRate: 38.1, totalSale: 1268219, avgSale: 16910, avgProposals: 2.6, avgProposalTime: 2382,
    channels: {
      "KimKim": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "Zicasso": { trips: 83, won: 20, lost: 63, convRate: 24.1, avgSale: 18058 },
      "WendyPerrin": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
      "B2B": { trips: 99, won: 48, lost: 51, convRate: 48.5, avgSale: 17333 },
      "Direct": { trips: 9, won: 4, lost: 5, convRate: 44.4, avgSale: 11684 },
      "DMC": { trips: 2, won: 2, lost: 0, convRate: 100, avgSale: 5359 },
      "MICE": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
    },
    lossReasons: [{ reason: "Cancelled", count: 37 }, { reason: "Unresponsive end customer", count: 26 }, { reason: "Won by competition", count: 16 }, { reason: "Other", count: 12 }],
  },
];

const ITALY_DATA: SubsidiaryData = {
  subsidiary: "Italy",
  brand: "Authenticus Italy",
  totalTrips: 1142,
  confirmed: 388,
  lost: 754,
  conversionRate: 34.0,
  totalSale: 7122893,
  avgSale: 18358,
  advisorCount: 8,
  agencyCount: 143,
  avgDaysToClose: 22,
  avgNights: 8.2,
  avgTravelers: 2.6,
  channels: {
    "KimKim": { trips: 243, won: 51, lost: 192, convRate: 21.0, avgSale: 12732 },
    "Zicasso": { trips: 281, won: 52, lost: 229, convRate: 18.5, avgSale: 19543 },
    "WendyPerrin": { trips: 97, won: 54, lost: 43, convRate: 55.7, avgSale: 22812 },
    "B2B": { trips: 470, won: 207, lost: 263, convRate: 44.0, avgSale: 19215 },
    "Direct": { trips: 35, won: 17, lost: 18, convRate: 48.6, avgSale: 10894 },
    "DMC": { trips: 5, won: 4, lost: 1, convRate: 80.0, avgSale: 7110 },
    "MICE": { trips: 0, won: 0, lost: 0, convRate: 0, avgSale: 0 },
  },
  lossReasons: [
    { reason: "Unresponsive end customer", count: 280, pct: 37.1 },
    { reason: "Other", count: 125, pct: 16.6 },
    { reason: "Cancelled", count: 74, pct: 9.8 },
    { reason: "Budget/price mismatch", count: 73, pct: 9.7 },
    { reason: "Unresponsive agent", count: 58, pct: 7.7 },
    { reason: "Picked another destination", count: 51, pct: 6.8 },
    { reason: "Won by competition", count: 51, pct: 6.8 },
    { reason: "Postponed", count: 40, pct: 5.3 },
  ],
  advisors: ITALY_ADVISORS,
};

// Aggregate all detailed DMC data for "All" dropdown option
const ALL_DMC_AGGREGATE: SubsidiaryData = (() => {
  const all = [MOROCCO_DATA, ITALY_DATA];
  const totalTrips = all.reduce((s, d) => s + d.totalTrips, 0);
  const confirmed = all.reduce((s, d) => s + d.confirmed, 0);
  const lost = all.reduce((s, d) => s + d.lost, 0);
  const totalSale = all.reduce((s, d) => s + d.totalSale, 0);
  const channels = {} as SubsidiaryData["channels"];
  for (const ch of ["KimKim", "Zicasso", "WendyPerrin", "B2B", "Direct", "DMC", "MICE"] as ChannelGroup[]) {
    const trips = all.reduce((s, d) => s + d.channels[ch].trips, 0);
    const won = all.reduce((s, d) => s + d.channels[ch].won, 0);
    const chLost = all.reduce((s, d) => s + d.channels[ch].lost, 0);
    const totalRev = all.reduce((s, d) => s + d.channels[ch].won * d.channels[ch].avgSale, 0);
    channels[ch] = { trips, won, lost: chLost, convRate: trips > 0 ? parseFloat(((won / trips) * 100).toFixed(1)) : 0, avgSale: won > 0 ? Math.round(totalRev / won) : 0 };
  }
  const lrMap: Record<string, number> = {};
  for (const d of all) for (const lr of d.lossReasons) lrMap[lr.reason] = (lrMap[lr.reason] || 0) + lr.count;
  const lossReasons = Object.entries(lrMap).map(([reason, count]) => ({ reason, count, pct: lost > 0 ? parseFloat(((count / lost) * 100).toFixed(1)) : 0 })).sort((a, b) => b.count - a.count);
  return {
    subsidiary: "All", brand: "All DMCs", totalTrips, confirmed, lost,
    conversionRate: parseFloat(((confirmed / totalTrips) * 100).toFixed(1)),
    totalSale, avgSale: Math.round(totalSale / confirmed),
    advisorCount: all.reduce((s, d) => s + d.advisorCount, 0),
    agencyCount: all.reduce((s, d) => s + d.agencyCount, 0),
    avgDaysToClose: Math.round(all.reduce((s, d) => s + d.avgDaysToClose * d.totalTrips, 0) / totalTrips),
    avgNights: parseFloat((all.reduce((s, d) => s + d.avgNights * d.totalTrips, 0) / totalTrips).toFixed(1)),
    avgTravelers: parseFloat((all.reduce((s, d) => s + d.avgTravelers * d.totalTrips, 0) / totalTrips).toFixed(1)),
    channels, lossReasons,
    advisors: all.flatMap(d => d.advisors),
  };
})();

const DMC_OPTIONS: { key: string; data: SubsidiaryData }[] = [
  { key: "all", data: ALL_DMC_AGGREGATE },
  { key: "morocco", data: MOROCCO_DATA },
  { key: "italy", data: ITALY_DATA },
];

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

// Period scaling for mockup data (Jan 2025 – Mar 2026 = 15 months)
// Volume scales proportionally; rates and averages shift realistically per window
function periodScale(period: TimePeriod): number {
  if (period === "12m") return 0.80;
  if (period === "6m") return 0.45;
  if (period === "3m") return 0.22;
  return 1;
}
function scaledNum(n: number, period: TimePeriod): number {
  return Math.round(n * periodScale(period));
}
function scaledRate(rate: number, period: TimePeriod): number {
  // Recent periods trend slightly higher (advisors improving over time)
  if (period === "all") return rate;
  const shift = period === "3m" ? 1.8 : period === "6m" ? 0.9 : 0.3;
  return parseFloat((rate + shift).toFixed(1));
}
function scaledAvgSale(avgSale: number, period: TimePeriod): number {
  // Recent months skew higher (peak season, higher-value bookings closing)
  if (period === "all") return avgSale;
  const factor = period === "3m" ? 1.08 : period === "6m" ? 1.05 : 1.02;
  return Math.round(avgSale * factor);
}
function scaledAvgNights(nights: number, period: TimePeriod): number {
  // Recent trips trend slightly longer (more luxury itineraries)
  if (period === "all") return nights;
  const shift = period === "3m" ? 0.4 : period === "6m" ? 0.2 : 0.1;
  return parseFloat((nights + shift).toFixed(1));
}
function scaledAvgTravelers(travelers: number, period: TimePeriod): number {
  // Recent months slightly fewer travelers per trip (more couples vs groups)
  if (period === "all") return travelers;
  const shift = period === "3m" ? -0.3 : period === "6m" ? -0.2 : -0.1;
  return parseFloat(Math.max(1.5, travelers + shift).toFixed(1));
}
function scaledDaysToClose(days: number, period: TimePeriod): number {
  // Recent leads closing faster as team improves
  if (period === "all") return days;
  const shift = period === "3m" ? -3 : period === "6m" ? -2 : -1;
  return Math.max(10, days + shift);
}


/* ─────────────────── TIME PERIODS ─────────────────── */
type TimePeriod = "all" | "12m" | "6m" | "3m";
const TIME_PERIOD_LABELS: Record<TimePeriod, string> = {
  "all": "All Time",
  "12m": "Last 12 Months",
  "6m": "Last 6 Months",
  "3m": "Last 3 Months",
};

// Monthly trend data for Amal Amezargou (simulated from real totals, realistic distribution)
// Months: Jan 2025 → Mar 2026 (15 months of data)
const MONTHS = ["Jan 25","Feb 25","Mar 25","Apr 25","May 25","Jun 25","Jul 25","Aug 25","Sep 25","Oct 25","Nov 25","Dec 25","Jan 26","Feb 26","Mar 26"];

interface MonthlyData { won: number; lost: number; winRate: number; revenue: number }
type AdvisorMonthlyTrends = Record<string, Record<ChannelGroup, MonthlyData[]>>;

// Realistic monthly trends per advisor (showing Amal as example)
const ADVISOR_TRENDS: AdvisorMonthlyTrends = {
  "Amal Amezargou": {
    "B2B": [
      { won: 8, lost: 11, winRate: 42.1, revenue: 185600 }, { won: 10, lost: 13, winRate: 43.5, revenue: 232000 },
      { won: 11, lost: 14, winRate: 44.0, revenue: 255200 }, { won: 12, lost: 12, winRate: 50.0, revenue: 278400 },
      { won: 10, lost: 15, winRate: 40.0, revenue: 232000 }, { won: 9, lost: 12, winRate: 42.9, revenue: 208800 },
      { won: 8, lost: 10, winRate: 44.4, revenue: 185600 }, { won: 7, lost: 14, winRate: 33.3, revenue: 162400 },
      { won: 11, lost: 11, winRate: 50.0, revenue: 255200 }, { won: 10, lost: 13, winRate: 43.5, revenue: 232000 },
      { won: 12, lost: 10, winRate: 54.5, revenue: 278400 }, { won: 11, lost: 12, winRate: 47.8, revenue: 255200 },
      { won: 9, lost: 14, winRate: 39.1, revenue: 208800 }, { won: 8, lost: 10, winRate: 44.4, revenue: 185600 },
      { won: 6, lost: 10, winRate: 37.5, revenue: 139200 },
    ],
    "Zicasso": [
      { won: 1, lost: 1, winRate: 50.0, revenue: 19500 }, { won: 0, lost: 2, winRate: 0, revenue: 0 },
      { won: 1, lost: 1, winRate: 50.0, revenue: 19500 }, { won: 1, lost: 2, winRate: 33.3, revenue: 19500 },
      { won: 1, lost: 1, winRate: 50.0, revenue: 19500 }, { won: 0, lost: 2, winRate: 0, revenue: 0 },
      { won: 1, lost: 1, winRate: 50.0, revenue: 19500 }, { won: 1, lost: 2, winRate: 33.3, revenue: 19500 },
      { won: 1, lost: 1, winRate: 50.0, revenue: 19500 }, { won: 1, lost: 1, winRate: 50.0, revenue: 19500 },
      { won: 1, lost: 2, winRate: 33.3, revenue: 19500 }, { won: 0, lost: 1, winRate: 0, revenue: 0 },
      { won: 1, lost: 2, winRate: 33.3, revenue: 19500 }, { won: 1, lost: 1, winRate: 50.0, revenue: 19500 },
      { won: 0, lost: 1, winRate: 0, revenue: 0 },
    ],
    "WendyPerrin": [
      { won: 0, lost: 1, winRate: 0, revenue: 0 }, { won: 1, lost: 0, winRate: 100, revenue: 17800 },
      { won: 0, lost: 1, winRate: 0, revenue: 0 }, { won: 1, lost: 1, winRate: 50.0, revenue: 17800 },
      { won: 0, lost: 1, winRate: 0, revenue: 0 }, { won: 1, lost: 1, winRate: 50.0, revenue: 17800 },
      { won: 1, lost: 0, winRate: 100, revenue: 17800 }, { won: 0, lost: 1, winRate: 0, revenue: 0 },
      { won: 0, lost: 1, winRate: 0, revenue: 0 }, { won: 1, lost: 1, winRate: 50.0, revenue: 17800 },
      { won: 1, lost: 1, winRate: 50.0, revenue: 17800 }, { won: 0, lost: 1, winRate: 0, revenue: 0 },
      { won: 1, lost: 0, winRate: 100, revenue: 17800 }, { won: 0, lost: 1, winRate: 0, revenue: 0 },
      { won: 0, lost: 1, winRate: 0, revenue: 0 },
    ],
    "Direct": [
      { won: 1, lost: 2, winRate: 33.3, revenue: 15200 }, { won: 1, lost: 1, winRate: 50.0, revenue: 15200 },
      { won: 0, lost: 2, winRate: 0, revenue: 0 }, { won: 1, lost: 2, winRate: 33.3, revenue: 15200 },
      { won: 1, lost: 1, winRate: 50.0, revenue: 15200 }, { won: 0, lost: 2, winRate: 0, revenue: 0 },
      { won: 1, lost: 2, winRate: 33.3, revenue: 15200 }, { won: 1, lost: 2, winRate: 33.3, revenue: 15200 },
      { won: 1, lost: 2, winRate: 33.3, revenue: 15200 }, { won: 1, lost: 1, winRate: 50.0, revenue: 15200 },
      { won: 0, lost: 2, winRate: 0, revenue: 0 }, { won: 1, lost: 2, winRate: 33.3, revenue: 15200 },
      { won: 1, lost: 2, winRate: 33.3, revenue: 15200 }, { won: 1, lost: 2, winRate: 33.3, revenue: 15200 },
      { won: 0, lost: 1, winRate: 0, revenue: 0 },
    ],
    "KimKim": MONTHS.map(() => ({ won: 0, lost: 0, winRate: 0, revenue: 0 })),
    "DMC": [
      { won: 0, lost: 0, winRate: 0, revenue: 0 }, { won: 0, lost: 0, winRate: 0, revenue: 0 },
      { won: 1, lost: 0, winRate: 100, revenue: 12000 }, { won: 0, lost: 0, winRate: 0, revenue: 0 },
      { won: 0, lost: 0, winRate: 0, revenue: 0 }, { won: 0, lost: 0, winRate: 0, revenue: 0 },
      { won: 0, lost: 0, winRate: 0, revenue: 0 }, { won: 0, lost: 0, winRate: 0, revenue: 0 },
      { won: 1, lost: 0, winRate: 100, revenue: 12000 }, { won: 0, lost: 0, winRate: 0, revenue: 0 },
      { won: 0, lost: 0, winRate: 0, revenue: 0 }, { won: 0, lost: 0, winRate: 0, revenue: 0 },
      { won: 0, lost: 0, winRate: 0, revenue: 0 }, { won: 0, lost: 0, winRate: 0, revenue: 0 },
      { won: 0, lost: 0, winRate: 0, revenue: 0 },
    ],
    "MICE": MONTHS.map(() => ({ won: 0, lost: 0, winRate: 0, revenue: 0 })),
  },
};

// Helper: get period-filtered data from monthly trends
function getFilteredTrend(months: MonthlyData[], period: TimePeriod): { won: number; lost: number; winRate: number; revenue: number } {
  const sliceCount = period === "3m" ? 3 : period === "6m" ? 6 : period === "12m" ? 12 : months.length;
  const slice = months.slice(-sliceCount);
  const won = slice.reduce((s, m) => s + m.won, 0);
  const lost = slice.reduce((s, m) => s + m.lost, 0);
  const total = won + lost;
  return { won, lost, winRate: total > 0 ? (won / total) * 100 : 0, revenue: slice.reduce((s, m) => s + m.revenue, 0) };
}

// Helper: get previous period for comparison
function getPreviousPeriodTrend(months: MonthlyData[], period: TimePeriod): { winRate: number } | null {
  const sliceCount = period === "3m" ? 3 : period === "6m" ? 6 : period === "12m" ? 12 : 0;
  if (sliceCount === 0 || months.length < sliceCount * 2) return null;
  const prevSlice = months.slice(-(sliceCount * 2), -sliceCount);
  const won = prevSlice.reduce((s, m) => s + m.won, 0);
  const total = won + prevSlice.reduce((s, m) => s + m.lost, 0);
  return { winRate: total > 0 ? (won / total) * 100 : 0 };
}

// Channel colors for the trend chart
const CHANNEL_COLORS: Record<ChannelGroup, string> = {
  "KimKim": "#6366F1",
  "Zicasso": "#8B5CF6",
  "WendyPerrin": "#EC4899",
  "B2B": "#3B82F6",
  "Direct": "#F59E0B",
  "DMC": "#10B981",
  "MICE": "#6B7280",
};

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
  const hardcodedAdmin = isAdmin(userEmail);
  const [hasDbAccess, setHasDbAccess] = useState(false);

  useEffect(() => {
    fetch("/api/auth/permissions")
      .then(r => r.json())
      .then(d => { if (d.isDbAdmin || d.gmForBrand) setHasDbAccess(true); })
      .catch(() => {});
  }, []);

  const userIsAdmin = hardcodedAdmin || hasDbAccess;

  const [activeSection, setActiveSection] = useState<NavSection>("overview");
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [panelWidth, setPanelWidth] = useState(260);
  const [calibration, setCalibration] = useState(DEFAULT_CALIBRATION);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all");
  const [engagementChannel, setEngagementChannel] = useState<"all" | "B2B" | "B2C" | "Direct">("all");
  const [activeDMCKey, setActiveDMCKey] = useState<string>("morocco");
  const activeDMCData = DMC_OPTIONS.find(d => d.key === activeDMCKey)?.data ?? MOROCCO_DATA;
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

  /* ─────── SHARED UI HELPERS ─────── */
  const renderTimePills = () => (
    <div className="flex rounded-lg border border-[#E8ECF1] overflow-hidden">
      {(["all", "12m", "6m", "3m"] as TimePeriod[]).map(p => (
        <button key={p} onClick={() => setTimePeriod(p)} className={`px-3 py-1.5 text-xs font-medium transition-colors ${timePeriod === p ? "bg-[#304256] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
          {TIME_PERIOD_LABELS[p]}
        </button>
      ))}
    </div>
  );

  const renderDmcDropdown = () => (
    <select
      value={activeDMCKey}
      onChange={(e) => { setActiveDMCKey(e.target.value); setSelectedAdvisor(null); }}
      className="px-3 py-1.5 rounded-lg text-xs font-medium border border-[#E8ECF1] bg-white text-[#304256] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30"
    >
      {DMC_OPTIONS.map(opt => (
        <option key={opt.key} value={opt.key}>{opt.data.brand}</option>
      ))}
    </select>
  );

  const periodLabel = timePeriod === "all" ? "Jan 2025 – present" : `Last ${timePeriod === "12m" ? "12 months" : timePeriod === "6m" ? "6 months" : "3 months"}`;

  /* ─────── RENDER: GLOBAL OVERVIEW ─────── */
  const renderOverview = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#304256] mb-1">Global Sales Overview</h2>
          <p className="text-sm text-gray-500">All destinations, {periodLabel} &middot; {scaledNum(6664, timePeriod).toLocaleString()} trips across 16 subsidiaries</p>
        </div>
        {renderTimePills()}
      </div>

      {/* Global stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Trips", value: scaledNum(6664, timePeriod).toLocaleString(), sub: "Confirmed + Lost" },
          { label: "Overall Win Rate", value: fmtPct(scaledRate(34.5, timePeriod)), sub: `${scaledNum(2325, timePeriod).toLocaleString()} won of ${scaledNum(6664, timePeriod).toLocaleString()}` },
          { label: "Total Revenue", value: fmtCurrency(scaledNum(41400000, timePeriod)), sub: "Contracted sale price" },
          { label: "Avg Trip Value", value: fmtCurrency(scaledAvgSale(17800, timePeriod)), sub: "Per confirmed trip" },
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
                const tripsRaw = ch === "KimKim" ? 529 : ch === "Zicasso" ? 874 : ch === "WendyPerrin" ? 271 : ch === "B2B" ? 3899 : ch === "Direct" ? 866 : ch === "DMC" ? 127 : 58;
                const wonRaw = ch === "KimKim" ? 93 : ch === "Zicasso" ? 169 : ch === "WendyPerrin" ? 141 : ch === "B2B" ? 1553 : ch === "Direct" ? 283 : ch === "DMC" ? 51 : 27;
                const trips = scaledNum(tripsRaw, timePeriod);
                const won = scaledNum(wonRaw, timePeriod);
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
              {ALL_SUBSIDIARIES.map((s) => {
                const sTrips = scaledNum(s.trips, timePeriod);
                const sRate = scaledRate(s.convRate, timePeriod);
                return (
                <tr
                  key={s.subsidiary}
                  className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 cursor-pointer"
                  onClick={() => {
                    const dmcKey = DMC_OPTIONS.find(o => o.data.brand === s.brand)?.key;
                    if (dmcKey) { setActiveDMCKey(dmcKey); setActiveSection("dmc-detail"); }
                  }}
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: DMC_COLORS[s.brand] || "#304256" }} />
                      <span className="font-medium text-[#304256]">{s.brand}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-600">{sTrips.toLocaleString()}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={`font-semibold tabular-nums ${sRate >= 35 ? "text-[#27a28c]" : sRate >= 28 ? "text-amber-500" : "text-red-500"}`}>
                      {fmtPct(sRate)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(scaledNum(s.totalSale, timePeriod))}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(scaledAvgSale(s.avgSale, timePeriod))}</td>
                  <td className="px-5 py-3 text-right tabular-nums text-gray-400">{s.advisors}</td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* ─────── RENDER: DMC DETAIL (Morocco) ─────── */
  const renderDmcDetail = () => {
    const d = activeDMCData;
    const brandColor = DMC_COLORS[d.brand] || "#304256";

    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {d.brand !== "All DMCs" && <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brandColor }} />}
                <h2 className="text-xl font-bold text-[#304256]">{d.brand}</h2>
              </div>
              {renderDmcDropdown()}
            </div>
            {renderTimePills()}
          </div>
          <p className="text-sm text-gray-500">{periodLabel} &middot; {scaledNum(d.totalTrips, timePeriod).toLocaleString()} trips &middot; {d.advisorCount} advisors &middot; {d.agencyCount} agency partners</p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Win Rate", value: fmtPct(scaledRate(d.conversionRate, timePeriod)) },
            { label: "Revenue", value: fmtCurrency(scaledNum(d.totalSale, timePeriod)) },
            { label: "Avg Sale", value: fmtCurrency(scaledAvgSale(d.avgSale, timePeriod)) },
            { label: "Avg Days to Close", value: `${scaledDaysToClose(d.avgDaysToClose, timePeriod)}d` },
            { label: "Avg Trip", value: `${scaledAvgNights(d.avgNights, timePeriod)} nights / ${scaledAvgTravelers(d.avgTravelers, timePeriod)} pax` },
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
                  const cRate = scaledRate(c.convRate, timePeriod);
                  const vsTarget = cRate - cal.targetConvRate;
                  const vsTc = cRate - tcAvg.convRate;
                  return (
                    <tr key={ch} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-5 py-3 font-medium text-[#304256]">{CHANNEL_GROUP_LABELS[ch]}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-gray-600">{scaledNum(c.trips, timePeriod).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-gray-600">{scaledNum(c.won, timePeriod).toLocaleString()}</td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-semibold tabular-nums ${convColor(cRate, cal.targetConvRate)}`}>{fmtPct(cRate)}</span>
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
                      <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(scaledAvgSale(c.avgSale, timePeriod))}</td>
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
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{scaledNum(adv.totalTrips, timePeriod)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-semibold tabular-nums ${scaledRate(adv.conversionRate, timePeriod) >= scaledRate(d.conversionRate, timePeriod) ? "text-[#27a28c]" : scaledRate(adv.conversionRate, timePeriod) >= scaledRate(d.conversionRate, timePeriod) * 0.85 ? "text-amber-500" : "text-red-500"}`}>
                        {fmtPct(scaledRate(adv.conversionRate, timePeriod))}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(scaledAvgSale(adv.avgSale, timePeriod))}</td>
                    <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(scaledNum(adv.totalSale, timePeriod))}</td>
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
    const adv = activeDMCData.advisors.find((a) => a.name === selectedAdvisor) || activeDMCData.advisors[0];
    const dmcAvg = activeDMCData;
    const brandColor = DMC_COLORS[dmcAvg.brand] || "#304256";
    const trends = ADVISOR_TRENDS[adv.name];
    const hasTrends = !!trends;

    // Calculate period-filtered totals if trends available
    const periodStats = hasTrends ? (() => {
      let totalWon = 0, totalLost = 0, totalRevenue = 0;
      for (const ch of ALL_CHANNELS) {
        if (!trends[ch]) continue;
        const f = getFilteredTrend(trends[ch], timePeriod);
        totalWon += f.won;
        totalLost += f.lost;
        totalRevenue += f.revenue;
      }
      const total = totalWon + totalLost;
      return { won: totalWon, lost: totalLost, total, winRate: total > 0 ? (totalWon / total) * 100 : 0, revenue: totalRevenue };
    })() : { won: adv.confirmed, lost: adv.lost, total: adv.totalTrips, winRate: adv.conversionRate, revenue: adv.totalSale };

    // Generate AI insights based on trend data
    const generateInsights = (): string[] => {
      if (!hasTrends) return [];
      const insights: string[] = [];
      for (const ch of ALL_CHANNELS) {
        if (!trends[ch]) continue;
        const current = getFilteredTrend(trends[ch], "3m");
        const prev = getPreviousPeriodTrend(trends[ch], "3m");
        if (current.won + current.lost < 3) continue;
        if (prev && prev.winRate > 0) {
          const delta = current.winRate - prev.winRate;
          if (delta > 8) {
            insights.push(`${CHANNEL_GROUP_LABELS[ch]} win rate trending up — ${fmtPct(current.winRate)} last 3 months vs ${fmtPct(prev.winRate)} prior period.`);
          } else if (delta < -8) {
            insights.push(`${CHANNEL_GROUP_LABELS[ch]} declining — was ${fmtPct(prev.winRate)}, now ${fmtPct(current.winRate)} over last 3 months. Worth reviewing recent lost quotes.`);
          }
        }
        const cal = calibration[ch];
        if (current.winRate < cal.targetConvRate * 0.7 && current.won + current.lost >= 5) {
          insights.push(`${CHANNEL_GROUP_LABELS[ch]} well below ${fmtPct(cal.targetConvRate)} target — only ${current.won} of ${current.won + current.lost} won in last 3 months.`);
        }
      }
      // B2B specific since it's the biggest channel
      if (trends["B2B"]) {
        const b2b3m = getFilteredTrend(trends["B2B"], "3m");
        if (b2b3m.winRate > dmcAvg.channels["B2B"].convRate + 5) {
          insights.push(`B2B is the strongest channel — outperforming DMC average by ${(b2b3m.winRate - dmcAvg.channels["B2B"].convRate).toFixed(0)}pts recently.`);
        }
      }
      return insights.slice(0, 4);
    };

    const insights = generateInsights();

    // Build comparative loss reasons (vs DMC average)
    const getComparativeLossReasons = () => {
      const dmcLossMap: Record<string, number> = {};
      for (const lr of dmcAvg.lossReasons) {
        dmcLossMap[lr.reason] = lr.pct;
      }
      return adv.lossReasons.map(lr => {
        const advPct = adv.lost > 0 ? (lr.count / adv.lost) * 100 : 0;
        const dmcPct = dmcLossMap[lr.reason] || 0;
        const delta = advPct - dmcPct;
        return { reason: lr.reason, advPct, dmcPct, delta, count: lr.count };
      }).sort((a, b) => b.delta - a.delta);
    };

    return (
      <div className="space-y-5">
        {/* Header + time pills */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => setActiveSection("dmc-detail")}
              className="text-xs text-[#27a28c] hover:underline flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              Back to {dmcAvg.brand}
            </button>
            {renderDmcDropdown()}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: brandColor }}>
                {adv.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#304256]">{adv.name}</h2>
                <p className="text-sm text-gray-500">{dmcAvg.brand}</p>
              </div>
            </div>
            {/* Time period pills */}
            <div className="flex rounded-lg border border-[#E8ECF1] overflow-hidden">
              {(["all", "12m", "6m", "3m"] as TimePeriod[]).map(p => (
                <button
                  key={p}
                  onClick={() => setTimePeriod(p)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    timePeriod === p
                      ? "bg-[#304256] text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {TIME_PERIOD_LABELS[p]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary stats (period-filtered) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Win Rate", value: fmtPct(periodStats.winRate), sub: `${periodStats.won} won of ${periodStats.total}` },
            { label: "Avg Sale", value: periodStats.won > 0 ? fmtCurrency(periodStats.revenue / periodStats.won) : "$0", sub: `DMC avg: ${fmtCurrency(scaledAvgSale(dmcAvg.avgSale, timePeriod))}` },
            { label: "Revenue", value: fmtCurrency(periodStats.revenue), sub: `${periodStats.won} confirmed trips` },
            { label: "Trips", value: periodStats.total.toString(), sub: `${periodStats.won} won / ${periodStats.lost} lost` },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-[#E8ECF1] p-4">
              <p className="text-xl font-bold text-[#304256]">{s.value}</p>
              <p className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</p>
              <p className="text-[11px] text-gray-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Compact channel table */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <h3 className="font-semibold text-[#304256]">Channel Performance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                  <th className="text-left px-5 py-3 font-medium text-gray-500">Channel</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Win Rate</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">vs Target</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Avg Sale</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Won / Lost</th>
                  <th className="text-right px-5 py-3 font-medium text-gray-500">Trend</th>
                </tr>
              </thead>
              <tbody>
                {ALL_CHANNELS.filter(ch => adv.channels[ch].trips > 0).map((ch) => {
                  const cal = calibration[ch];
                  // Use period-filtered data if trends exist
                  const hasCh = hasTrends && trends[ch];
                  const filtered = hasCh ? getFilteredTrend(trends[ch], timePeriod) : null;
                  const prev = hasCh ? getPreviousPeriodTrend(trends[ch], timePeriod) : null;
                  const winRate = filtered ? filtered.winRate : adv.channels[ch].convRate;
                  const won = filtered ? filtered.won : adv.channels[ch].won;
                  const lost = filtered ? filtered.lost : adv.channels[ch].lost;
                  const avgSale = filtered && filtered.won > 0 ? Math.round(filtered.revenue / filtered.won) : scaledAvgSale(adv.channels[ch].avgSale, timePeriod);
                  const vsTarget = winRate - cal.targetConvRate;

                  // Trend indicator
                  let trendIcon = "";
                  let trendText = "";
                  let trendColor = "text-gray-400";
                  if (prev && (won + lost) >= 3) {
                    const delta = winRate - prev.winRate;
                    if (delta > 5) { trendIcon = "\u25B2"; trendText = `was ${fmtPct(prev.winRate)}`; trendColor = "text-[#27a28c]"; }
                    else if (delta < -5) { trendIcon = "\u25BC"; trendText = `was ${fmtPct(prev.winRate)}`; trendColor = "text-red-500"; }
                    else { trendIcon = "\u2501"; trendText = "steady"; trendColor = "text-gray-400"; }
                  }

                  return (
                    <tr key={ch} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: CHANNEL_COLORS[ch] }} />
                          <span className="font-medium text-[#304256]">{CHANNEL_GROUP_LABELS[ch]}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`font-semibold tabular-nums ${convColor(winRate, cal.targetConvRate)}`}>
                          {fmtPct(winRate)}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={`text-xs font-medium tabular-nums ${vsTarget >= 0 ? "text-[#27a28c]" : "text-red-500"}`}>
                          {vsTarget >= 0 ? "+" : ""}{vsTarget.toFixed(1)}pts
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums text-gray-600">{fmtCurrency(avgSale)}</td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm tabular-nums">
                          <span className="text-[#27a28c] font-medium">{won}</span>
                          <span className="text-gray-300 mx-0.5">/</span>
                          <span className="text-red-400 font-medium">{lost}</span>
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {trendIcon ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className={`text-sm ${trendColor}`}>{trendIcon}</span>
                            <span className="text-[10px] text-gray-400">{trendText}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-gray-300">&mdash;</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z"/></svg>
              <h4 className="text-sm font-semibold text-[#0C4A6E]">Insights</h4>
            </div>
            <ul className="space-y-2">
              {insights.map((insight, i) => (
                <li key={i} className="text-sm text-[#0369A1] leading-relaxed flex gap-2">
                  <span className="text-[#0284C7] mt-0.5 flex-shrink-0">&bull;</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ═══════ DEEP INSIGHTS ═══════ */}

        {/* INSIGHT 1: Deal Engagement — proposal count × loss reason, filtered by channel */}
        {(() => {
          type EngagementSet = Record<"all" | "B2B" | "B2C" | "Direct", {
            summary: { label: string; winRate: number; lost: number; total: number }[];
            rows: { reason: string; p0: number; p12: number; p34: number; p5: number; diagnosis: string; flag: boolean }[];
            narrative: string;
          }>;
          type EngagementTabs = { key: "all" | "B2B" | "B2C" | "Direct"; label: string; count: number }[];

          // Per-advisor engagement data, keyed by name
          const ENGAGEMENT_BY_ADVISOR: Record<string, { data: EngagementSet; tabs: EngagementTabs }> = {
            "Amal Amezargou": {
              tabs: [
                { key: "all", label: "All Channels", count: 239 },
                { key: "B2B", label: "B2B Agencies", count: 179 },
                { key: "B2C", label: "B2C Platforms", count: 37 },
                { key: "Direct", label: "Direct", count: 23 },
              ],
              data: {
                all: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 66, total: 66 },
                    { label: "1-2 proposals", winRate: 18, lost: 126, total: 153 },
                    { label: "3-4 proposals", winRate: 61, lost: 31, total: 79 },
                    { label: "5+ proposals", winRate: 86, lost: 16, total: 113 },
                  ],
                  rows: [
                    { reason: "Unresponsive end customer", p0: 26, p12: 21, p34: 1, p5: 1, diagnosis: "Includes B2C platform noise", flag: false },
                    { reason: "Unresponsive agent", p0: 8, p12: 26, p34: 1, p5: 6, diagnosis: "Agent dropped after 1st proposal", flag: true },
                    { reason: "Budget/price mismatch", p0: 3, p12: 17, p34: 7, p5: 1, diagnosis: "Price rejected at proposal stage", flag: true },
                    { reason: "Picked another destination", p0: 7, p12: 16, p34: 5, p5: 0, diagnosis: "Lost interest in Morocco", flag: false },
                    { reason: "Other / uncategorised", p0: 17, p12: 33, p34: 9, p5: 4, diagnosis: "Data quality gap", flag: false },
                    { reason: "Won by competition", p0: 2, p12: 4, p34: 2, p5: 0, diagnosis: "Competitive loss", flag: false },
                    { reason: "Postponed / Cancelled", p0: 3, p12: 9, p34: 6, p5: 4, diagnosis: "Timing issue", flag: false },
                  ],
                  narrative: "All-channel view is noisy \u2014 B2C platforms (KimKim, Zicasso) naturally have high unresponsive rates. Filter to B2B for the clearest coaching signal.",
                },
                B2B: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 30, total: 30 },
                    { label: "1-2 proposals", winRate: 17, lost: 104, total: 125 },
                    { label: "3-4 proposals", winRate: 64, lost: 26, total: 72 },
                    { label: "5+ proposals", winRate: 86, lost: 14, total: 96 },
                  ],
                  rows: [
                    { reason: "Unresponsive agent", p0: 6, p12: 25, p34: 1, p5: 6, diagnosis: "Agent saw proposal and walked away", flag: true },
                    { reason: "Budget/price mismatch", p0: 3, p12: 17, p34: 7, p5: 1, diagnosis: "Missed budget before 1st proposal", flag: true },
                    { reason: "Picked another destination", p0: 6, p12: 14, p34: 4, p5: 0, diagnosis: "Morocco wasn\u2019t the right fit", flag: false },
                    { reason: "Other / uncategorised", p0: 14, p12: 31, p34: 7, p5: 4, diagnosis: "Data quality gap", flag: false },
                    { reason: "Unresponsive end customer", p0: 3, p12: 8, p34: 1, p5: 0, diagnosis: "End traveller went cold", flag: false },
                    { reason: "Postponed / Cancelled", p0: 1, p12: 8, p34: 4, p5: 4, diagnosis: "Timing issue", flag: false },
                  ],
                  narrative: "B2B is where the actionable signal lives. 42 deals lost at 1-2 proposals to \u201cunresponsive agent\u201d (25) or \u201cbudget mismatch\u201d (17). These are real agency relationships where the agent saw the first proposal and disengaged \u2014 either the price was off or the itinerary didn\u2019t match the brief. Coaching focus: confirm budget expectations before sending the first proposal; follow up within 24h.",
                },
                B2C: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 30, total: 30 },
                    { label: "1-2 proposals", winRate: 22, lost: 14, total: 18 },
                    { label: "3-4 proposals", winRate: 57, lost: 3, total: 7 },
                    { label: "5+ proposals", winRate: 100, lost: 0, total: 10 },
                  ],
                  rows: [
                    { reason: "Unresponsive end customer", p0: 15, p12: 6, p34: 0, p5: 0, diagnosis: "Platform leads going cold \u2014 expected", flag: false },
                    { reason: "Won by competition", p0: 2, p12: 3, p34: 1, p5: 0, diagnosis: "Zicasso/WP comparison shoppers", flag: false },
                    { reason: "Picked another destination", p0: 1, p12: 1, p34: 1, p5: 0, diagnosis: "Not committed to Morocco", flag: false },
                    { reason: "Other / uncategorised", p0: 2, p12: 2, p34: 1, p5: 0, diagnosis: "\u2014", flag: false },
                  ],
                  narrative: "B2C platform leads (KimKim, Zicasso, Wendy Perrin) have naturally high drop-off \u2014 15 of 30 zero-proposal losses are \u201cunresponsive end customer\u201d. This is the platform model: travellers submit to multiple DMCs and go with whoever responds best. Low signal here for coaching; focus on response speed instead.",
                },
                Direct: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 11, total: 11 },
                    { label: "1-2 proposals", winRate: 27, lost: 8, total: 11 },
                    { label: "3-4 proposals", winRate: 40, lost: 3, total: 5 },
                    { label: "5+ proposals", winRate: 71, lost: 2, total: 7 },
                  ],
                  rows: [
                    { reason: "Unresponsive end customer", p0: 8, p12: 7, p34: 0, p5: 1, diagnosis: "Lead went cold", flag: false },
                    { reason: "Unresponsive agent", p0: 1, p12: 1, p34: 0, p5: 0, diagnosis: "\u2014", flag: false },
                    { reason: "Other", p0: 1, p12: 0, p34: 1, p5: 0, diagnosis: "\u2014", flag: false },
                    { reason: "Picked another destination", p0: 0, p12: 1, p34: 0, p5: 0, diagnosis: "\u2014", flag: false },
                  ],
                  narrative: "Direct enquiries are mostly unresponsive end customers \u2014 leads who found Morocco online but didn\u2019t commit. Small sample (34 trips) so limited signal.",
                },
              },
            },
            "Elisa Sciabica": {
              tabs: [
                { key: "all", label: "All Channels", count: 222 },
                { key: "B2B", label: "B2B Agencies", count: 29 },
                { key: "B2C", label: "B2C Platforms", count: 187 },
                { key: "Direct", label: "Direct", count: 2 },
              ],
              data: {
                all: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 105, total: 105 },
                    { label: "1-2 proposals", winRate: 17, lost: 93, total: 112 },
                    { label: "3-4 proposals", winRate: 65, lost: 20, total: 57 },
                    { label: "5+ proposals", winRate: 92, lost: 4, total: 48 },
                  ],
                  rows: [
                    { reason: "Unresponsive end customer", p0: 69, p12: 25, p34: 5, p5: 1, diagnosis: "Dominated by B2C platform noise", flag: false },
                    { reason: "Cancelled", p0: 11, p12: 13, p34: 2, p5: 1, diagnosis: "Travel plans changed", flag: false },
                    { reason: "Other / uncategorised", p0: 7, p12: 14, p34: 4, p5: 1, diagnosis: "Data quality gap", flag: false },
                    { reason: "Won by competition", p0: 4, p12: 12, p34: 4, p5: 0, diagnosis: "Competitor won the deal", flag: false },
                    { reason: "Postponed", p0: 5, p12: 12, p34: 1, p5: 0, diagnosis: "Timing issue", flag: false },
                    { reason: "Budget/price mismatch", p0: 1, p12: 10, p34: 3, p5: 1, diagnosis: "Price rejected at proposal stage", flag: true },
                    { reason: "Picked another destination", p0: 8, p12: 5, p34: 1, p5: 0, diagnosis: "Lost interest in Italy", flag: false },
                  ],
                  narrative: "Elisa\u2019s portfolio is 75% B2C platforms (Zicasso + KimKim) where 0-proposal losses are expected. The all-channel view is misleading \u2014 filter to B2B for actionable signal, or B2C to benchmark platform performance.",
                },
                B2B: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 2, total: 2 },
                    { label: "1-2 proposals", winRate: 22, lost: 18, total: 23 },
                    { label: "3-4 proposals", winRate: 68, lost: 7, total: 22 },
                    { label: "5+ proposals", winRate: 91, lost: 2, total: 22 },
                  ],
                  rows: [
                    { reason: "Other / uncategorised", p0: 0, p12: 6, p34: 3, p5: 0, diagnosis: "Needs better categorisation", flag: false },
                    { reason: "Won by competition", p0: 0, p12: 4, p34: 0, p5: 0, diagnosis: "Lost to competing DMC", flag: true },
                    { reason: "Cancelled", p0: 1, p12: 1, p34: 1, p5: 1, diagnosis: "Travel plans changed", flag: false },
                    { reason: "Budget/price mismatch", p0: 0, p12: 2, p34: 1, p5: 1, diagnosis: "Price rejected", flag: false },
                    { reason: "Unresponsive end customer", p0: 1, p12: 1, p34: 1, p5: 0, diagnosis: "End traveller went cold", flag: false },
                    { reason: "Unresponsive agent", p0: 0, p12: 2, p34: 0, p5: 0, diagnosis: "Agent disengaged", flag: false },
                  ],
                  narrative: "B2B is Elisa\u2019s strongest channel at 58% win rate (vs 44% Italy avg). Only 29 lost B2B trips total. \u201cWon by competition\u201d is the top flag at 1-2 proposals \u2014 agencies compared her proposal to another DMC and went elsewhere. Smaller sample but clean data.",
                },
                B2C: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 102, total: 102 },
                    { label: "1-2 proposals", winRate: 15, lost: 71, total: 84 },
                    { label: "3-4 proposals", winRate: 61, lost: 12, total: 31 },
                    { label: "5+ proposals", winRate: 91, lost: 2, total: 23 },
                  ],
                  rows: [
                    { reason: "Unresponsive end customer", p0: 67, p12: 21, p34: 4, p5: 1, diagnosis: "Platform comparison shoppers \u2014 expected", flag: false },
                    { reason: "Won by competition", p0: 4, p12: 8, p34: 4, p5: 0, diagnosis: "Zicasso comparison shopping", flag: true },
                    { reason: "Cancelled", p0: 10, p12: 12, p34: 1, p5: 0, diagnosis: "Travel plans changed", flag: false },
                    { reason: "Postponed", p0: 5, p12: 10, p34: 0, p5: 0, diagnosis: "Timing issue", flag: false },
                    { reason: "Budget/price mismatch", p0: 1, p12: 8, p34: 2, p5: 0, diagnosis: "Price rejected by traveller", flag: true },
                    { reason: "Other", p0: 7, p12: 8, p34: 0, p5: 1, diagnosis: "\u2014", flag: false },
                    { reason: "Picked another destination", p0: 8, p12: 4, p34: 1, p5: 0, diagnosis: "Italy wasn\u2019t the right fit", flag: false },
                  ],
                  narrative: "B2C platforms (Zicasso 156 + KimKim 84): 67 of 102 zero-proposal losses are unresponsive travellers \u2014 normal for the platform model. The signal is at 1-2 proposals: 8 \u201cwon by competition\u201d and 8 \u201cbudget mismatch\u201d. Zicasso travellers compare multiple DMCs \u2014 speed of response and competitive pricing matter most here.",
                },
                Direct: {
                  summary: [
                    { label: "0 proposals", winRate: 0, lost: 1, total: 1 },
                    { label: "1-2 proposals", winRate: 50, lost: 1, total: 2 },
                    { label: "3-4 proposals", winRate: 100, lost: 0, total: 2 },
                    { label: "5+ proposals", winRate: 100, lost: 0, total: 2 },
                  ],
                  rows: [
                    { reason: "Unresponsive end customer", p0: 1, p12: 1, p34: 0, p5: 0, diagnosis: "Lead went cold", flag: false },
                  ],
                  narrative: "Only 7 direct enquiries (5 won) \u2014 too small a sample for meaningful analysis.",
                },
              },
            },
          };

          const advEngagement = ENGAGEMENT_BY_ADVISOR[adv.name];
          if (!advEngagement) {
            return (
              <div className="bg-white rounded-xl border border-[#E8ECF1] p-6 text-center">
                <p className="text-sm text-gray-400">Deal Engagement Signal data not yet analysed for {adv.name}.</p>
                <p className="text-xs text-gray-300 mt-1">Select Amal Amezargou (Morocco) or Elisa Sciabica (Italy) for deep insights.</p>
              </div>
            );
          }

          const ed = advEngagement.data[engagementChannel];
          const channelTabs = advEngagement.tabs;

          return (
            <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8ECF1]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                      </span>
                      <h3 className="font-semibold text-[#304256]">Deal Engagement Signal</h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Proposal count × loss reason — filtered by channel</p>
                  </div>
                </div>
                {/* Channel filter tabs */}
                <div className="flex gap-1 mt-3">
                  {channelTabs.map(t => (
                    <button
                      key={t.key}
                      onClick={() => setEngagementChannel(t.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        engagementChannel === t.key
                          ? "bg-[#304256] text-white"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {t.label} <span className="opacity-60">({t.count})</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-5">
                {/* Win rate by proposal count */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {ed.summary.map((b, i) => (
                    <div key={b.label} className={`rounded-lg p-3 text-center ${b.winRate < 20 ? "bg-red-50 border border-red-100" : b.winRate < 50 ? "bg-amber-50 border border-amber-100" : "bg-green-50 border border-green-100"}`}>
                      <p className={`text-lg font-bold ${b.winRate < 20 ? "text-red-600" : b.winRate < 50 ? "text-amber-600" : "text-[#27a28c]"}`}>{b.winRate}%</p>
                      <p className="text-[11px] font-medium text-[#304256]">{b.label}</p>
                      <p className="text-[10px] text-gray-400">{b.lost} lost of {b.total}</p>
                      {i === 0 && engagementChannel === "all" && <p className="text-[9px] text-amber-600 mt-0.5">* see data note</p>}
                    </div>
                  ))}
                </div>

                {/* Data quality note — only show on All */}
                {engagementChannel === "all" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4 flex items-start gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5"><path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      <strong>Data note:</strong> 18.6% of all TC trips have 0 proposals — but 143 are <em>confirmed</em> deals. Some advisors don&apos;t log proposals in SF, and group trips skip the proposal workflow. B2C platforms also inflate &ldquo;unresponsive&rdquo; numbers. <strong>Filter to B2B for the clearest coaching signal.</strong>
                    </p>
                  </div>
                )}

                {/* Cross-reference table */}
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Lost deals: proposal count × loss reason</p>
                <div className="overflow-x-auto mb-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                        <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs">Loss Reason</th>
                        <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">0 props</th>
                        <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">1-2 props</th>
                        <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">3-4 props</th>
                        <th className="text-center px-3 py-2 font-medium text-gray-500 text-xs">5+ props</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs w-44">Diagnosis</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ed.rows.map(r => (
                        <tr key={r.reason} className={`border-b border-gray-50 last:border-b-0 ${r.flag ? "bg-red-50/30" : ""}`}>
                          <td className="px-3 py-2 text-xs text-[#304256] font-medium">{r.reason}</td>
                          <td className={`px-3 py-2 text-center text-xs tabular-nums ${r.p0 >= 10 ? "font-bold text-red-600" : "text-gray-500"}`}>{r.p0}</td>
                          <td className={`px-3 py-2 text-center text-xs tabular-nums ${r.p12 >= 15 ? "font-bold text-amber-600" : "text-gray-500"}`}>{r.p12}</td>
                          <td className="px-3 py-2 text-center text-xs tabular-nums text-gray-400">{r.p34}</td>
                          <td className="px-3 py-2 text-center text-xs tabular-nums text-gray-400">{r.p5}</td>
                          <td className="px-3 py-2">
                            {r.flag ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">{r.diagnosis}</span>
                            ) : (
                              <span className="text-[10px] text-gray-400">{r.diagnosis}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={`rounded-lg p-3 ${engagementChannel === "B2B" ? "bg-blue-50 border border-blue-200" : engagementChannel === "B2C" ? "bg-purple-50 border border-purple-200" : engagementChannel === "Direct" ? "bg-gray-50 border border-gray-200" : "bg-blue-50 border border-blue-200"}`}>
                  <p className={`text-sm leading-relaxed ${engagementChannel === "B2B" ? "text-blue-800" : engagementChannel === "B2C" ? "text-purple-800" : engagementChannel === "Direct" ? "text-gray-700" : "text-blue-800"}`}>
                    {ed.narrative}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* INSIGHT 2: Agency Intelligence */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </span>
              <h3 className="font-semibold text-[#304256]">Agency Intelligence</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">Same agency, different results — where are the gaps?</p>
          </div>
          <div className="p-5 space-y-3">
            {(adv.name === "Elisa Sciabica" ? [
              { agency: "Zicasso", advRate: 19, advTrips: 156, bestAdvisor: "Giulia Catalano", bestRate: 24, bestTrips: 83, worstAdvisor: "Vincenzo Granato", worstRate: 5, worstTrips: 39 },
              { agency: "KimKim", advRate: 29, advTrips: 84, bestAdvisor: "Elisa (you)", bestRate: 29, bestTrips: 84, worstAdvisor: "Eleonora Arrigoni", worstRate: 20, worstTrips: 84 },
              { agency: "Fora", advRate: 67, advTrips: 21, bestAdvisor: "Elisa (you)", bestRate: 67, bestTrips: 21, worstAdvisor: "Martina Venturi", worstRate: 38, worstTrips: 16 },
              { agency: "Designer Journeys", advRate: 20, advTrips: 5, bestAdvisor: "Giulia Catalano", bestRate: 25, bestTrips: 4, worstAdvisor: "Elisa (you)", worstRate: 20, worstTrips: 5 },
            ] : [
              { agency: "Fora", advRate: 34, advTrips: 50, bestAdvisor: "Nebia Noucair", bestRate: 100, bestTrips: 11, worstAdvisor: "Sara LAGHRIBI", worstRate: 18, worstTrips: 78 },
              { agency: "Departure Lounge", advRate: 83, advTrips: 12, bestAdvisor: "Amal (you)", bestRate: 83, bestTrips: 12, worstAdvisor: "Hiba EL IKLIL", worstRate: 25, worstTrips: 4 },
              { agency: "SmartFlyer", advRate: 65, advTrips: 23, bestAdvisor: "Salma EL KHLYFI", bestRate: 70, bestTrips: 10, worstAdvisor: "Reem KARMOUTAH", worstRate: 0, worstTrips: 3 },
              { agency: "Brownell", advRate: 75, advTrips: 12, bestAdvisor: "Amal (you)", bestRate: 75, bestTrips: 12, worstAdvisor: "Sara LAGHRIBI", worstRate: 33, worstTrips: 6 },
            ]).map(a => (
              <div key={a.agency} className="flex items-center gap-4 py-2 border-b border-gray-50 last:border-b-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#304256]">{a.agency}</span>
                    <span className="text-[10px] text-gray-400">({a.advTrips} trips)</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className={`text-xs font-semibold tabular-nums ${a.advRate >= 50 ? "text-[#27a28c]" : a.advRate >= 30 ? "text-amber-500" : "text-red-500"}`}>
                      You: {a.advRate}%
                    </span>
                    {a.bestAdvisor !== "Amal (you)" && (
                      <span className="text-[10px] text-gray-400">
                        Best: {a.bestAdvisor} {a.bestRate}% ({a.bestTrips})
                      </span>
                    )}
                    <span className="text-[10px] text-gray-400">
                      Lowest: {a.worstAdvisor} {a.worstRate}% ({a.worstTrips})
                    </span>
                  </div>
                </div>
                <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                  <div className={`h-full rounded-full ${a.advRate >= 50 ? "bg-[#27a28c]" : a.advRate >= 30 ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${a.advRate}%` }} />
                </div>
              </div>
            ))}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-purple-800 leading-relaxed">
                {adv.name === "Elisa Sciabica"
                  ? <><strong>Zicasso is Elisa&apos;s biggest channel (156 trips) at 19% win rate</strong> — below Giulia&apos;s 24% on the same platform. KimKim performs slightly better at 29%. B2B agency Fora is a bright spot at 67% — significantly outperforming Martina (38%) on the same agency.</>
                  : <><strong>Fora is your biggest agency partner (50 trips) but only 34% win rate</strong> — well below your overall 42%. Meanwhile Nebia converts Fora at 100% on 11 trips. Your strongest agency is Departure Lounge at 83% — worth understanding what makes that relationship work.</>
                }
              </p>
            </div>
          </div>
        </div>

        {/* INSIGHT 3: Trip Profile — who do they win? */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              </span>
              <h3 className="font-semibold text-[#304256]">Trip Profile Sweet Spot</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">Win rate by trip duration and group size</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 gap-6">
              {/* By nights */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">By Duration</p>
                <div className="space-y-2">
                  {(adv.name === "Elisa Sciabica" ? [
                    { label: "1-4 nights", rate: 27, trips: 22, dmcRate: 35 },
                    { label: "5-7 nights", rate: 30, trips: 73, dmcRate: 34 },
                    { label: "8-10 nights", rate: 28, trips: 120, dmcRate: 30 },
                    { label: "11+ nights", rate: 36, trips: 107, dmcRate: 38 },
                  ] : [
                    { label: "1-4 nights", rate: 41, trips: 95, dmcRate: 38 },
                    { label: "5-7 nights", rate: 46, trips: 123, dmcRate: 36 },
                    { label: "8-10 nights", rate: 43, trips: 121, dmcRate: 37 },
                    { label: "11+ nights", rate: 33, trips: 72, dmcRate: 34 },
                  ]).map(b => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="text-xs text-[#304256] w-20">{b.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.rate >= b.dmcRate ? "bg-[#27a28c]" : "bg-amber-400"}`} style={{ width: `${b.rate}%` }} />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-[#304256] w-10 text-right">{b.rate}%</span>
                      <span className="text-[10px] text-gray-400 w-6">({b.trips})</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* By group size */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">By Group Size</p>
                <div className="space-y-2">
                  {(adv.name === "Elisa Sciabica" ? [
                    { label: "1-2 pax", rate: 31, trips: 196, dmcRate: 34 },
                    { label: "3-4 pax", rate: 28, trips: 83, dmcRate: 33 },
                    { label: "5-6 pax", rate: 28, trips: 25, dmcRate: 38 },
                    { label: "7+ pax", rate: 50, trips: 18, dmcRate: 32 },
                  ] : [
                    { label: "1-2 pax", rate: 38, trips: 220, dmcRate: 34 },
                    { label: "3-4 pax", rate: 48, trips: 129, dmcRate: 38 },
                    { label: "5-6 pax", rate: 43, trips: 53, dmcRate: 35 },
                    { label: "7+ pax", rate: 44, trips: 9, dmcRate: 36 },
                  ]).map(b => (
                    <div key={b.label} className="flex items-center gap-3">
                      <span className="text-xs text-[#304256] w-20">{b.label}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.rate >= b.dmcRate ? "bg-[#27a28c]" : "bg-amber-400"}`} style={{ width: `${b.rate}%` }} />
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-[#304256] w-10 text-right">{b.rate}%</span>
                      <span className="text-[10px] text-gray-400 w-6">({b.trips})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-amber-800 leading-relaxed">
                {adv.name === "Elisa Sciabica"
                  ? <><strong>Elisa&apos;s win rates are fairly flat across durations (27-36%)</strong> — slightly below Italy DMC average for shorter trips. Her sweet spot is 7+ pax groups (50%) and 11+ night itineraries (36%). Couples dominate volume (196 trips, 61%) but convert at only 31%.</>
                  : <><strong>Amal converts best on 5-7 night trips (46%) and 3-4 pax groups (48%).</strong> Win rate drops to 33% on 11+ night trips — these complex itineraries may need a different approach. Couples (1-2 pax) make up 54% of volume but only convert at 38%.</>
                }
              </p>
            </div>
          </div>
        </div>

        {/* INSIGHT 4: Speed to Close */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
              </span>
              <h3 className="font-semibold text-[#304256]">Speed to Close</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">How fast do won deals close vs team?</p>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {(adv.name === "Elisa Sciabica" ? [
                { label: "Median days to close", value: "22d", compare: "Italy DMC: 22d", ok: true },
                { label: "Closed within 14 days", value: "32%", compare: "Italy avg: 28%", ok: true },
                { label: "Deals dragging 60+ days", value: "9%", compare: "Italy avg: 10%", ok: true },
              ] : [
                { label: "Avg days to close", value: "29d", compare: "DMC: 26d", ok: false },
                { label: "Closed within 14 days", value: "30%", compare: "Best: Oumaima 81%", ok: false },
                { label: "Deals dragging 60+ days", value: "11%", compare: "Best: Oumaima 4%", ok: true },
              ]).map(s => (
                <div key={s.label} className="bg-gray-50 rounded-lg p-3">
                  <p className={`text-lg font-bold ${s.ok ? "text-[#304256]" : "text-amber-600"}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  <p className="text-[10px] text-gray-400 mt-1">{s.compare}</p>
                </div>
              ))}
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800 leading-relaxed">
                {adv.name === "Elisa Sciabica"
                  ? <><strong>Elisa&apos;s closing speed is right at the Italy average</strong> — median 22 days, 32% within 14 days. No red flags here. All Italy advisors cluster around 21-27 day medians, unlike Morocco where Oumaima significantly outpaces the team.</>
                  : <><strong>Oumaima closes 81% of deals within 14 days</strong> (median: 4 days) vs Amal at 30%. Oumaima handles higher-value clients ($40K avg) and still closes faster. The speed difference may reflect different client segments, but worth investigating her follow-up cadence.</>
                }
              </p>
            </div>
          </div>
        </div>

        {/* INSIGHT 5: Loss Pattern vs DMC — comparative */}
        <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E8ECF1]">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              </span>
              <h3 className="font-semibold text-[#304256]">Loss Pattern vs DMC Average</h3>
            </div>
            <p className="text-xs text-gray-400 mt-1">Where does this advisor lose more (or less) than peers?</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E8ECF1] bg-gray-50/50">
                  <th className="text-left px-5 py-2.5 font-medium text-gray-500">Loss Reason</th>
                  <th className="text-right px-5 py-2.5 font-medium text-gray-500">You</th>
                  <th className="text-right px-5 py-2.5 font-medium text-gray-500">DMC Avg</th>
                  <th className="text-right px-5 py-2.5 font-medium text-gray-500">vs DMC</th>
                  <th className="text-center px-5 py-2.5 font-medium text-gray-500 w-20">Signal</th>
                </tr>
              </thead>
              <tbody>
                {getComparativeLossReasons().map(lr => {
                  const isFlagged = lr.delta >= 5;
                  const isGood = lr.delta <= -5;
                  return (
                    <tr key={lr.reason} className={`border-b border-gray-100 last:border-b-0 ${isFlagged ? "bg-red-50/40" : ""}`}>
                      <td className="px-5 py-2.5">
                        <span className={`text-sm ${isFlagged ? "font-medium text-red-700" : "text-[#304256]"}`}>{lr.reason}</span>
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums text-sm">
                        <span className={isFlagged ? "font-semibold text-red-600" : "text-gray-600"}>{lr.advPct.toFixed(1)}%</span>
                      </td>
                      <td className="px-5 py-2.5 text-right tabular-nums text-sm text-gray-400">{lr.dmcPct.toFixed(1)}%</td>
                      <td className="px-5 py-2.5 text-right">
                        <span className={`text-xs font-medium tabular-nums ${isFlagged ? "text-red-500" : isGood ? "text-[#27a28c]" : "text-gray-400"}`}>
                          {lr.delta > 0 ? "+" : ""}{lr.delta.toFixed(1)}pts
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-center">
                        {isFlagged && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-semibold">
                            Above avg
                          </span>
                        )}
                        {isGood && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#27a28c]/10 text-[#27a28c] text-[10px] font-semibold">
                            Below avg
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(() => {
            const reasons = getComparativeLossReasons();
            const flagged = reasons.filter(r => r.delta >= 5);
            const good = reasons.filter(r => r.delta <= -5);
            if (flagged.length === 0 && good.length === 0) return null;
            return (
              <div className="px-5 py-3 border-t border-[#E8ECF1] bg-gray-50/50">
                <p className="text-xs text-gray-500 leading-relaxed">
                  {flagged.length > 0 && (<>
                    <strong>Above average: </strong>
                    {flagged.map((r, i) => (
                      <span key={r.reason}>{i > 0 ? "; " : ""}<strong>{r.reason}</strong> at {r.advPct.toFixed(1)}% vs DMC {r.dmcPct.toFixed(1)}% (+{r.delta.toFixed(1)}pts)</span>
                    ))}
                    {". "}
                  </>)}
                  {good.length > 0 && (<>
                    <strong>Below average: </strong>
                    {good.map((r, i) => (
                      <span key={r.reason}>{i > 0 ? "; " : ""}<strong>{r.reason}</strong> at {r.advPct.toFixed(1)}% vs DMC {r.dmcPct.toFixed(1)}% ({r.delta.toFixed(1)}pts)</span>
                    ))}
                    {"."}
                  </>)}
                </p>
              </div>
            );
          })()}
        </div>
      </div>
    );
  };

  /* ─────── RENDER: LOSS ANALYSIS ─────── */
  const renderLossAnalysis = () => {
    const d = activeDMCData;
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
                  <span className="text-[#304256] font-medium">{scaledNum(6664, timePeriod).toLocaleString()}</span>
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
