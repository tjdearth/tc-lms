"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import AppShell from "@/components/AppShell";

const DmcWorldMap = dynamic(() => import("@/components/DmcWorldMap"), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-xl border border-[#E8ECF1] p-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
    </div>
  ),
});

interface Office {
  city: string;
  brand: string;
  country: string;
  lat: number;
  lon: number;
  brandColor: string;
  timezone: string;
}

const OFFICES: Office[] = [
  { city: "Dubai", brand: "Majlis Retreats & Travel Collection", country: "UAE", lat: 25.2048, lon: 55.2708, brandColor: "#B28A72", timezone: "Asia/Dubai" },
  { city: "London", brand: "Crown Journey", country: "UK", lat: 51.5074, lon: -0.1278, brandColor: "#6D7581", timezone: "Europe/London" },
  { city: "Paris", brand: "Essentially French", country: "France", lat: 48.8566, lon: 2.3522, brandColor: "#58392E", timezone: "Europe/Paris" },
  { city: "Milan", brand: "Authenticus Italy", country: "Italy", lat: 45.4642, lon: 9.19, brandColor: "#C6B356", timezone: "Europe/Rome" },
  { city: "Madrid", brand: "Unbox Spain & Portugal", country: "Spain", lat: 40.4168, lon: -3.7038, brandColor: "#7C1137", timezone: "Europe/Madrid" },
  { city: "Athens", brand: "Nostos Greece", country: "Greece", lat: 37.9838, lon: 23.7275, brandColor: "#0E1952", timezone: "Europe/Athens" },
  { city: "Istanbul", brand: "Sar Turkiye", country: "Turkiye", lat: 41.0082, lon: 28.9784, brandColor: "#247F82", timezone: "Europe/Istanbul" },
  { city: "Marrakech", brand: "Experience Morocco", country: "Morocco", lat: 31.6295, lon: -7.9811, brandColor: "#F56A23", timezone: "Africa/Casablanca" },
  { city: "Casablanca", brand: "Experience Morocco", country: "Morocco", lat: 33.5731, lon: -7.5898, brandColor: "#F56A23", timezone: "Africa/Casablanca" },
  { city: "Arusha", brand: "Truly Swahili", country: "Tanzania", lat: -3.3869, lon: 36.6830, brandColor: "#4F9E2D", timezone: "Africa/Dar_es_Salaam" },
  { city: "Tokyo", brand: "Oshinobi Travel", country: "Japan", lat: 35.6762, lon: 139.6503, brandColor: "#E9395E", timezone: "Asia/Tokyo" },
  { city: "Bali", brand: "Kembali Indonesia", country: "Indonesia", lat: -8.3405, lon: 115.092, brandColor: "#ADA263", timezone: "Asia/Makassar" },
  { city: "Bangkok", brand: "Nira Thailand", country: "Thailand", lat: 13.7563, lon: 100.5018, brandColor: "#636218", timezone: "Asia/Bangkok" },
  { city: "Adelaide", brand: "Elura Australia", country: "Australia", lat: -34.9285, lon: 138.6007, brandColor: "#B04D32", timezone: "Australia/Adelaide" },
  { city: "Mexico City", brand: "Across Mexico", country: "Mexico", lat: 19.4326, lon: -99.1332, brandColor: "#E56456", timezone: "America/Mexico_City" },
  { city: "Lima", brand: "Awaken Peru", country: "Peru", lat: -12.0464, lon: -77.0428, brandColor: "#95AFA2", timezone: "America/Lima" },
  { city: "Bogota", brand: "Vista Colombia", country: "Colombia", lat: 4.711, lon: -74.0721, brandColor: "#FEE9A8", timezone: "America/Bogota" },
  { city: "Rabat", brand: "Travel Collection", country: "Morocco", lat: 34.0209, lon: -6.8417, brandColor: "#304256", timezone: "Africa/Casablanca" },
];

function getLocalTime(timezone: string): string {
  return new Date().toLocaleTimeString("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

interface WeatherData {
  temperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
  humidity: number;
}

const WMO_DESCRIPTIONS: Record<number, string> = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Rime Fog",
  51: "Light Drizzle",
  53: "Drizzle",
  55: "Heavy Drizzle",
  56: "Freezing Drizzle",
  57: "Heavy Freezing Drizzle",
  61: "Light Rain",
  63: "Moderate Rain",
  65: "Heavy Rain",
  66: "Freezing Rain",
  67: "Heavy Freezing Rain",
  71: "Light Snow",
  73: "Moderate Snow",
  75: "Heavy Snow",
  77: "Snow Grains",
  80: "Light Showers",
  81: "Showers",
  82: "Heavy Showers",
  85: "Light Snow Showers",
  86: "Heavy Snow Showers",
  95: "Thunderstorm",
  96: "Thunderstorm with Hail",
  99: "Heavy Thunderstorm",
};

function WeatherIcon({ code, isDay, size = 32 }: { code: number; isDay: boolean; size?: number }) {
  const color = isDay ? "#F59E0B" : "#94A3B8";

  if (code <= 1) {
    if (isDay) {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="5" fill={color} opacity="0.9" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 12 + Math.cos(rad) * 7;
            const y1 = 12 + Math.sin(rad) * 7;
            const x2 = 12 + Math.cos(rad) * 9;
            const y2 = 12 + Math.sin(rad) * 9;
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1.5" strokeLinecap="round" />;
          })}
        </svg>
      );
    }
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill={color} opacity="0.8" />
      </svg>
    );
  }

  if (code === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {isDay && <circle cx="8" cy="8" r="3.5" fill="#F59E0B" opacity="0.8" />}
        <path d="M18 18H8a4 4 0 0 1-.88-7.9A5.5 5.5 0 0 1 18 12.1 3 3 0 0 1 18 18z" fill="#CBD5E1" />
      </svg>
    );
  }

  if (code === 3 || code === 45 || code === 48) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 18H8a4 4 0 0 1-.88-7.9A5.5 5.5 0 0 1 18 12.1 3 3 0 0 1 18 18z" fill="#94A3B8" />
        {(code === 45 || code === 48) && (
          <>
            <line x1="5" y1="20" x2="19" y2="20" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="7" y1="22" x2="17" y2="22" stroke="#CBD5E1" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    const heavy = code === 65 || code === 67 || code === 82;
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 14H8a4 4 0 0 1-.88-7.9A5.5 5.5 0 0 1 18 8.1 3 3 0 0 1 18 14z" fill="#94A3B8" />
        <line x1="8" y1="17" x2="8" y2="19" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="12" y1="17" x2="12" y2="20" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="16" y1="17" x2="16" y2="19" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
        {heavy && (
          <>
            <line x1="10" y1="19" x2="10" y2="22" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="14" y1="19" x2="14" y2="21" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
          </>
        )}
      </svg>
    );
  }

  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 14H8a4 4 0 0 1-.88-7.9A5.5 5.5 0 0 1 18 8.1 3 3 0 0 1 18 14z" fill="#94A3B8" />
        <circle cx="8" cy="18" r="1" fill="#BFDBFE" />
        <circle cx="12" cy="17" r="1" fill="#BFDBFE" />
        <circle cx="16" cy="19" r="1" fill="#BFDBFE" />
        <circle cx="10" cy="20" r="1" fill="#BFDBFE" />
        <circle cx="14" cy="21" r="1" fill="#BFDBFE" />
      </svg>
    );
  }

  if (code >= 95) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M18 12H8a4 4 0 0 1-.88-7.9A5.5 5.5 0 0 1 18 6.1 3 3 0 0 1 18 12z" fill="#64748B" />
        <path d="M13 14l-2 4h4l-2 4" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M18 18H8a4 4 0 0 1-.88-7.9A5.5 5.5 0 0 1 18 12.1 3 3 0 0 1 18 18z" fill="#CBD5E1" />
    </svg>
  );
}

interface DmcBrandInfo {
  name: string;
  countries: string[];
  color: string;
  city: string;
  description: string;
  established?: string;
  photo?: string;
}

interface TeamMember {
  name: string;
  email: string;
  avatar_url: string | null;
}

interface BrandTeam {
  gm: TeamMember | null;
  team: TeamMember[];
}

const DMC_BRANDS_INFO: DmcBrandInfo[] = [
  {
    name: "Authenticus Italy",
    countries: ["Italy"],
    color: "#C6B356",
    city: "Milan",
    description: "Crafting authentic Italian experiences that go beyond the ordinary — from hidden trattorias in Puglia to private vineyard tours in Piedmont.",
    established: "2022",
    photo: "/dmc-photos/Authenticus Italy.jpg",
  },
  {
    name: "Unbox Spain & Portugal",
    countries: ["Spain", "Portugal"],
    color: "#7C1137",
    city: "Madrid",
    description: "Unveiling the Iberian Peninsula's best-kept secrets — from Andalusian flamenco to Porto's historic cellars and Basque Country gastronomy.",
    established: "2023",
    photo: "/dmc-photos/Unbox Spain.jpg",
  },
  {
    name: "Truly Swahili",
    countries: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
    color: "#4F9E2D",
    city: "Arusha",
    description: "East Africa's premier DMC — from the Serengeti migration to gorilla trekking in Rwanda, delivering transformative safari and cultural experiences.",
    established: "2023",
    photo: "/dmc-photos/Truly Swahili (Cropped bleed).jpg",
  },
  {
    name: "Across Mexico",
    countries: ["Mexico"],
    color: "#E56456",
    city: "Mexico City",
    description: "Mexico in its full spectrum — ancient ruins, vibrant markets, Pacific coastlines, and the culinary heritage of a nation built on flavour.",
    established: "2024",
    photo: "/dmc-photos/Across Mexico.jpg",
  },
  {
    name: "Kembali Indonesia",
    countries: ["Indonesia", "Singapore", "Malaysia"],
    color: "#ADA263",
    city: "Bali",
    description: "Southeast Asia reimagined — from Bali's sacred temples and rice terraces to Borneo's rainforests and Singapore's urban sophistication.",
    established: "2024",
    photo: "/dmc-photos/Kembali Indonesia.jpg",
  },
  {
    name: "Majlis Retreats",
    countries: ["UAE"],
    color: "#B28A72",
    city: "Dubai",
    description: "Luxury meets Arabian hospitality — bespoke desert experiences, world-class dining, and exclusive access across the Emirates.",
    established: "2024",
    photo: "/dmc-photos/Majlis Retreats.jpg",
  },
  {
    name: "Crown Journey",
    countries: ["United Kingdom"],
    color: "#6D7581",
    city: "London",
    description: "The very best of Britain — from Highland castles and Cotswold manors to London's private members' clubs and beyond.",
    established: "2024",
    photo: "/dmc-photos/Crown Journey.jpg",
  },
  {
    name: "Oshinobi Travel",
    countries: ["Japan"],
    color: "#E9395E",
    city: "Tokyo",
    description: "Japan through an insider's lens — geisha districts, Michelin omakase counters, ancient ryokans, and the art of the Japanese journey.",
    established: "2024",
    photo: "/dmc-photos/Oshinobi Travel.jpg",
  },
  {
    name: "Essentially French",
    countries: ["France"],
    color: "#58392E",
    city: "Paris",
    description: "La France profonde — from Parisian ateliers and Loire Valley châteaux to Provence lavender fields and Riviera superyacht charters.",
    established: "2023",
    photo: "/dmc-photos/Essentially French.jpg",
  },
  {
    name: "Elura Australia",
    countries: ["Australia"],
    color: "#B04D32",
    city: "Adelaide",
    description: "Australia's vast landscapes — Great Barrier Reef diving, Outback expeditions, world-class wine regions, and indigenous cultural immersion.",
    established: "2025",
    photo: "/dmc-photos/Elura Australia (Aaron) DRAFT.png",
  },
  {
    name: "Nira Thailand",
    countries: ["Thailand"],
    color: "#636218",
    city: "Bangkok",
    description: "Thailand beyond the expected — hill tribe encounters in Chiang Rai, island-hopping in the Andaman Sea, and Bangkok's culinary revolution.",
    established: "2025",
    photo: "/dmc-photos/Nira Thailand (Nick) DRAFT.png",
  },
  {
    name: "Sar Turkiye",
    countries: ["Turkiye"],
    color: "#247F82",
    city: "Istanbul",
    description: "Where East meets West — Cappadocia's fairy chimneys, Istanbul's Grand Bazaar, Aegean coast retreats, and Anatolian heritage trails.",
    established: "2025",
    photo: "/dmc-photos/Sar Turkiye (Hazan) DRAFT.png",
  },
  {
    name: "Nostos Greece",
    countries: ["Greece"],
    color: "#0E1952",
    city: "Athens",
    description: "The Greek odyssey reimagined — private island retreats, ancient ruins by twilight, Aegean sailing, and Cretan farm-to-table feasts.",
    established: "2025",
    photo: "/dmc-photos/Nostos Greeee (Aris) DRAFT.png",
  },
  {
    name: "Vista Colombia",
    countries: ["Colombia"],
    color: "#FEE9A8",
    city: "Bogota",
    description: "Colombia's extraordinary diversity — coffee country haciendas, Caribbean coastline, Amazon expeditions, and Bogotá's vibrant art scene.",
    established: "2025",
    photo: "/dmc-photos/Vista Colombia (Santiago) DRAFT.png",
  },
  {
    name: "Awaken Peru",
    countries: ["Peru"],
    color: "#95AFA2",
    city: "Lima",
    description: "Peru's ancient and modern wonders — Machu Picchu by train, Lima's gastronomic boom, Sacred Valley lodges, and Lake Titicaca culture.",
    established: "2025",
    photo: "/dmc-photos/Awaken Peru (Diego) DRAFT.png",
  },
  {
    name: "Experience Morocco",
    countries: ["Morocco"],
    color: "#F56A23",
    city: "Marrakech",
    description: "Morocco's sensory tapestry — medina riads, Sahara desert camps, Atlas Mountain retreats, and the ancient traditions of a timeless kingdom.",
    established: "2013",
    photo: "/dmc-photos/Experience Morocco.jpg",
  },
];

const FX_CURRENCIES = [
  { code: "EUR", label: "Euro", cc: "eu" },
  { code: "GBP", label: "British Pound", cc: "gb" },
  { code: "AED", label: "UAE Dirham", cc: "ae" },
  { code: "MXN", label: "Mexican Peso", cc: "mx" },
  { code: "JPY", label: "Japanese Yen", cc: "jp" },
  { code: "AUD", label: "Australian Dollar", cc: "au" },
  { code: "THB", label: "Thai Baht", cc: "th" },
  { code: "MAD", label: "Moroccan Dirham", cc: "ma" },
  { code: "TRY", label: "Turkish Lira", cc: "tr" },
  { code: "IDR", label: "Indonesian Rupiah", cc: "id" },
  { code: "PEN", label: "Peruvian Sol", cc: "pe" },
  { code: "COP", label: "Colombian Peso", cc: "co" },
];

function FlagImg({ cc, size = 20 }: { cc: string; size?: number }) {
  return (
    <img
      src={`https://flagcdn.com/w40/${cc}.png`}
      alt={cc}
      width={size}
      height={Math.round(size * 0.75)}
      className="rounded-sm object-cover"
      style={{ width: size, height: Math.round(size * 0.75) }}
    />
  );
}

export default function CompanyPage() {
  const [activeTab, setActiveTab] = useState<"map" | "weather" | "fx" | "dmcs">("map");
  const [fxTarget, setFxTarget] = useState("EUR");
  const [weather, setWeather] = useState<Record<string, WeatherData>>({});
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [, setTick] = useState(0);
  const [selectedDmc, setSelectedDmc] = useState(0);
  const [showAllTeam, setShowAllTeam] = useState(false);
  const [teamByBrand, setTeamByBrand] = useState<Record<string, BrandTeam>>({});
  const [fxRates, setFxRates] = useState<Record<string, number>>({});
  const [fxHistory, setFxHistory] = useState<{ date: string; rate: number }[]>([]);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxLastUpdated, setFxLastUpdated] = useState("");
  const [fxPeriod, setFxPeriod] = useState(30);

  // Fetch FX rates when tab is active
  useEffect(() => {
    if (activeTab !== "fx") return;
    if (Object.keys(fxRates).length > 0) return; // already loaded
    setFxLoading(true);
    fetch("/api/company/fx")
      .then((r) => r.json())
      .then((data) => {
        if (data.rates) setFxRates(data.rates);
        if (data.lastUpdated) setFxLastUpdated(data.lastUpdated);
      })
      .catch(() => {})
      .finally(() => setFxLoading(false));
  }, [activeTab, fxRates]);

  // Fetch FX history when target currency changes
  useEffect(() => {
    if (activeTab !== "fx") return;
    setFxHistory([]);
    fetch(`/api/company/fx?history=${fxTarget}&days=${fxPeriod}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.history) setFxHistory(data.history);
      })
      .catch(() => {});
  }, [activeTab, fxTarget, fxPeriod]);

  // Fetch team members
  useEffect(() => {
    fetch("/api/company/team")
      .then((r) => (r.ok ? r.json() : {}))
      .then(setTeamByBrand)
      .catch(() => {});
  }, []);

  // Update local times every minute
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const results: Record<string, WeatherData> = {};
        const batches = [];
        for (let i = 0; i < OFFICES.length; i += 6) {
          batches.push(OFFICES.slice(i, i + 6));
        }
        for (const batch of batches) {
          const promises = batch.map(async (office) => {
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${office.lat}&longitude=${office.lon}&current=temperature_2m,weather_code,is_day,wind_speed_10m,relative_humidity_2m&timezone=auto`
            );
            if (res.ok) {
              const data = await res.json();
              results[office.city] = {
                temperature: Math.round(data.current.temperature_2m),
                weatherCode: data.current.weather_code,
                isDay: data.current.is_day === 1,
                windSpeed: Math.round(data.current.wind_speed_10m),
                humidity: data.current.relative_humidity_2m,
              };
            }
          });
          await Promise.all(promises);
        }
        setWeather(results);
        setLastUpdated(
          new Date().toLocaleString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        );
      } catch (err) {
        console.error("Weather fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, []);

  return (
    <AppShell>
      <div className="p-4 md:p-8 max-w-[1200px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#304256] mb-1">Company</h1>
          <p className="text-gray-500">
            Our global network of destination management companies
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-6 mb-6 border-b border-[#E8ECF1]">
          {([
            { key: "map" as const, label: "Global Presence" },
            { key: "weather" as const, label: "Office Weather" },
            { key: "fx" as const, label: "FX Rates" },
            { key: "dmcs" as const, label: "Local DMCs" },
          ]).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`pb-3 text-[13px] font-medium border-b-2 transition-colors -mb-px ${
                activeTab === tab.key
                  ? "border-[#27a28c] text-[#304256]"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Global Presence - Map */}
        {activeTab === "map" && <DmcWorldMap />}

        {/* Office Weather */}
        {activeTab === "weather" && (
          <>
            {lastUpdated && (
              <div className="flex justify-end mb-4">
                <span className="text-[11px] text-gray-400">Updated {lastUpdated}</span>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {OFFICES.map((office) => {
                  const w = weather[office.city];
                  const description = w ? WMO_DESCRIPTIONS[w.weatherCode] || "Unknown" : "—";
                  const localTime = getLocalTime(office.timezone);
                  return (
                    <div key={office.city} className="group relative bg-white rounded-xl border border-[#E8ECF1] overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-1" style={{ backgroundColor: office.brandColor }} />
                      <div className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-[#304256] mb-0.5">{office.city}</h3>
                            <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{office.brand}</p>
                          </div>
                          <div className="text-right flex-shrink-0 ml-3">
                            {w && (
                              <div>
                                <span className="text-3xl font-light text-[#304256] tabular-nums">{w.temperature}</span>
                                <span className="text-lg text-gray-300 font-light">°C</span>
                              </div>
                            )}
                            <div className="flex items-center justify-end gap-1.5 mt-0.5">
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                              <span className="text-xs font-medium text-gray-400 tabular-nums">{localTime}</span>
                            </div>
                          </div>
                        </div>
                        {w && (
                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E8ECF1]/60">
                            <div className="flex items-center gap-2">
                              <WeatherIcon code={w.weatherCode} isDay={w.isDay} size={24} />
                              <span className="text-xs text-gray-500">{description}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-gray-400">
                              <span className="flex items-center gap-1" title="Wind">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.59 4.59A2 2 0 1 1 11 8H2" /><path d="M12.59 19.41A2 2 0 1 0 14 16H2" /><path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" /></svg>
                                {w.windSpeed} km/h
                              </span>
                              <span className="flex items-center gap-1" title="Humidity">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" /></svg>
                                {w.humidity}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* FX Rates */}
        {activeTab === "fx" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Rate Table */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-[#E8ECF1] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E8ECF1] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#304256]">1 USD =</h3>
                {fxLastUpdated && (
                  <span className="text-[10px] text-gray-300">Updated {fxLastUpdated}</span>
                )}
              </div>
              {fxLoading ? (
                <div className="p-12 flex justify-center">
                  <div className="w-6 h-6 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {FX_CURRENCIES.map((c) => {
                    const rate = fxRates[c.code];
                    const isActive = fxTarget === c.code;
                    return (
                      <button
                        key={c.code}
                        onClick={() => setFxTarget(c.code)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${
                          isActive ? "bg-[#304256]/5" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <FlagImg cc={c.cc} />
                          <div>
                            <p className={`text-sm font-medium ${isActive ? "text-[#304256]" : "text-gray-700"}`}>{c.code}</p>
                            <p className="text-[11px] text-gray-400">{c.label}</p>
                          </div>
                        </div>
                        <span className={`text-sm font-mono ${isActive ? "text-[#304256] font-semibold" : "text-gray-600"}`}>
                          {rate ? (rate >= 100 ? rate.toLocaleString(undefined, { maximumFractionDigits: 0 }) : rate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })) : "—"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chart */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-[#E8ECF1] shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-[#E8ECF1]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-semibold text-[#304256]">
                    USD → {fxTarget}
                  </h3>
                  <div className="flex items-center gap-1">
                    {[
                      { label: "7D", days: 7 },
                      { label: "30D", days: 30 },
                      { label: "90D", days: 90 },
                      { label: "1Y", days: 365 },
                    ].map((p) => (
                      <button
                        key={p.days}
                        onClick={() => setFxPeriod(p.days)}
                        className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                          fxPeriod === p.days
                            ? "bg-[#304256] text-white"
                            : "text-gray-400 hover:text-[#304256] hover:bg-gray-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
                {fxRates[fxTarget] && (
                  <p className="text-2xl font-bold text-[#304256]">
                    {fxRates[fxTarget] >= 100
                      ? fxRates[fxTarget].toLocaleString(undefined, { maximumFractionDigits: 0 })
                      : fxRates[fxTarget].toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                    <span className="text-sm font-normal text-gray-400 ml-2 inline-flex items-center gap-1">
                      <FlagImg cc={FX_CURRENCIES.find((c) => c.code === fxTarget)?.cc || ""} size={16} /> {FX_CURRENCIES.find((c) => c.code === fxTarget)?.label}
                    </span>
                  </p>
                )}
              </div>
              <div className="px-4 py-3 border-b border-[#E8ECF1]/60 flex flex-wrap gap-1.5">
                {FX_CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setFxTarget(c.code)}
                    className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                      fxTarget === c.code
                        ? "bg-[#304256] text-white"
                        : "text-gray-400 hover:text-[#304256] hover:bg-gray-50"
                    }`}
                  >
                    <span className="inline-flex items-center gap-1"><FlagImg cc={c.cc} size={14} /> {c.code}</span>
                  </button>
                ))}
              </div>
              <div className="p-6">
                {fxHistory.length > 1 ? (() => {
                  const rates = fxHistory.map((p) => p.rate);
                  const min = Math.min(...rates);
                  const max = Math.max(...rates);
                  const range = max - min || 1;
                  const W = 580;
                  const H = 260;
                  const padY = 20;
                  const points = fxHistory.map((p, i) => {
                    const x = (i / (fxHistory.length - 1)) * W;
                    const y = padY + (1 - (p.rate - min) / range) * (H - 2 * padY);
                    return `${x},${y}`;
                  });
                  const line = points.join(" ");
                  // Y-axis labels
                  const ySteps = 5;
                  const yLabels = Array.from({ length: ySteps + 1 }, (_, i) => {
                    const val = min + (range * i) / ySteps;
                    return {
                      val,
                      y: padY + (1 - i / ySteps) * (H - 2 * padY),
                    };
                  });
                  // X-axis labels (first, mid, last)
                  const xLabels = [
                    { label: fxHistory[0].date.slice(5), x: 0 },
                    { label: fxHistory[Math.floor(fxHistory.length / 2)].date.slice(5), x: W / 2 },
                    { label: fxHistory[fxHistory.length - 1].date.slice(5), x: W },
                  ];

                  return (
                    <svg viewBox={`-50 0 ${W + 60} ${H + 30}`} className="w-full h-auto">
                      {/* Grid lines */}
                      {yLabels.map((yl, i) => (
                        <g key={i}>
                          <line x1={0} y1={yl.y} x2={W} y2={yl.y} stroke="#f0f0f0" strokeWidth={1} />
                          <text x={-8} y={yl.y + 4} textAnchor="end" fill="#9ca3af" fontSize={10}>
                            {yl.val >= 100 ? yl.val.toFixed(0) : yl.val.toFixed(4)}
                          </text>
                        </g>
                      ))}
                      {/* Area fill */}
                      <path d={`M0,${padY + (1 - (rates[0] - min) / range) * (H - 2 * padY)} ${points.map((p) => `L${p}`).join(" ")} L${W},${H} L0,${H} Z`} fill="url(#fxGradient)" />
                      <defs>
                        <linearGradient id="fxGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#27a28c" stopOpacity={0.15} />
                          <stop offset="100%" stopColor="#27a28c" stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      {/* Line */}
                      <polyline points={line} fill="none" stroke="#27a28c" strokeWidth={2} strokeLinejoin="round" />
                      {/* Current value dot */}
                      <circle cx={W} cy={padY + (1 - (rates[rates.length - 1] - min) / range) * (H - 2 * padY)} r={4} fill="#27a28c" />
                      {/* X-axis */}
                      {xLabels.map((xl, i) => (
                        <text key={i} x={xl.x} y={H + 18} textAnchor="middle" fill="#9ca3af" fontSize={10}>
                          {xl.label}
                        </text>
                      ))}
                    </svg>
                  );
                })() : (
                  <div className="h-[260px] flex items-center justify-center">
                    {fxHistory.length === 0 && !["EUR", "GBP", "MXN", "JPY", "AUD", "THB", "TRY", "IDR"].includes(fxTarget) ? (
                      <p className="text-sm text-gray-400">Historical data not available for {fxTarget}</p>
                    ) : (
                      <div className="w-6 h-6 border-2 border-[#27a28c]/30 border-t-[#27a28c] rounded-full animate-spin" />
                    )}
                  </div>
                )}
              </div>
              {fxHistory.length > 1 && (() => {
                const rates = fxHistory.map((p) => p.rate);
                const min = Math.min(...rates);
                const max = Math.max(...rates);
                const first = rates[0];
                const last = rates[rates.length - 1];
                const change = ((last - first) / first) * 100;
                return (
                  <div className="px-6 pb-4 grid grid-cols-4 gap-4">
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">{fxPeriod <= 7 ? "7d" : fxPeriod <= 30 ? "30d" : fxPeriod <= 90 ? "90d" : "1y"} High</p>
                      <p className="text-sm font-semibold text-[#304256]">{max >= 100 ? max.toFixed(0) : max.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">{fxPeriod <= 7 ? "7d" : fxPeriod <= 30 ? "30d" : fxPeriod <= 90 ? "90d" : "1y"} Low</p>
                      <p className="text-sm font-semibold text-[#304256]">{min >= 100 ? min.toFixed(0) : min.toFixed(4)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">{fxPeriod <= 7 ? "7d" : fxPeriod <= 30 ? "30d" : fxPeriod <= 90 ? "90d" : "1y"} Change</p>
                      <p className={`text-sm font-semibold ${change >= 0 ? "text-green-600" : "text-red-500"}`}>
                        {change >= 0 ? "+" : ""}{change.toFixed(2)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase">Data Points</p>
                      <p className="text-sm font-semibold text-[#304256]">{fxHistory.length}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Local DMCs */}
        {activeTab === "dmcs" && (() => {
          const brand = DMC_BRANDS_INFO[selectedDmc];
          const brandData = teamByBrand[brand.name];
          const gm = brandData?.gm || null;
          const team = brandData?.team || [];
          const visibleTeam = showAllTeam ? team : team.slice(0, 12);
          const hasMore = team.length > 12;

          return (
            <div>
              {/* Brand selector — dropdown + prev/next */}
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={() => { setSelectedDmc(selectedDmc === 0 ? DMC_BRANDS_INFO.length - 1 : selectedDmc - 1); setShowAllTeam(false); }}
                  className="p-2 rounded-lg border border-[#E8ECF1] bg-white hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#304256]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </button>

                <div className="relative flex-1 max-w-xs">
                  <select
                    value={selectedDmc}
                    onChange={(e) => { setSelectedDmc(Number(e.target.value)); setShowAllTeam(false); }}
                    className="w-full appearance-none bg-white border border-[#E8ECF1] rounded-lg pl-4 pr-10 py-2.5 text-sm font-medium text-[#304256] focus:outline-none focus:border-[#27a28c] focus:ring-1 focus:ring-[#27a28c]/30 cursor-pointer"
                  >
                    {DMC_BRANDS_INFO.map((b, i) => (
                      <option key={b.name} value={i}>{b.name}</option>
                    ))}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </div>

                <button
                  onClick={() => { setSelectedDmc(selectedDmc === DMC_BRANDS_INFO.length - 1 ? 0 : selectedDmc + 1); setShowAllTeam(false); }}
                  className="p-2 rounded-lg border border-[#E8ECF1] bg-white hover:bg-gray-50 transition-colors text-gray-400 hover:text-[#304256]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
                </button>

                <span className="text-[11px] text-gray-300 tabular-nums ml-1">{selectedDmc + 1} / {DMC_BRANDS_INFO.length}</span>
              </div>

              {/* Hero showcase card */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-[#E8ECF1]">
                <div className="grid grid-cols-1 lg:grid-cols-5">
                  {/* Photo — takes 2/5 */}
                  <div className="relative lg:col-span-2 h-64 lg:h-auto min-h-[360px]">
                    {brand.photo ? (
                      <img src={brand.photo} alt={brand.name} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: brand.color + "18" }}>
                        <p className="text-sm text-gray-400">Photo coming soon</p>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent lg:hidden" />
                    <div className="absolute top-0 left-0 w-full h-1 lg:w-1 lg:h-full lg:right-auto" style={{ backgroundColor: brand.color }} />
                  </div>

                  {/* Content — takes 3/5 */}
                  <div className="lg:col-span-3 p-6 lg:p-8 bg-white">
                    {/* Brand heading */}
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.color }} />
                        <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400">
                          {brand.countries.join(" · ")}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-[#304256] mb-3">{brand.name}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed max-w-lg">{brand.description}</p>
                    </div>

                    {/* Stats row */}
                    <div className="flex items-center gap-8 mb-8 pb-6 border-b border-[#E8ECF1]">
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Headquarters</p>
                        <p className="text-sm font-semibold text-[#304256]">{brand.city}</p>
                      </div>
                      <div className="w-px h-8 bg-[#E8ECF1]" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Established</p>
                        <p className="text-sm font-semibold text-[#304256]">{brand.established || "—"}</p>
                      </div>
                      <div className="w-px h-8 bg-[#E8ECF1]" />
                      <div>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-0.5">Team Size</p>
                        <p className="text-sm font-semibold text-[#304256]">{(gm ? 1 : 0) + team.length}</p>
                      </div>
                    </div>

                    {/* General Manager */}
                    <div className="mb-6">
                      <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-3">General Manager</h4>
                      {gm ? (
                        <div className="flex items-center gap-4">
                          {gm.avatar_url ? (
                            <img src={gm.avatar_url} alt={gm.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md" />
                          ) : (
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold text-white ring-2 ring-white shadow-md" style={{ backgroundColor: brand.color }}>
                              {gm.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-semibold text-[#304256]">{gm.name}</p>
                            <p className="text-[11px] text-gray-400">{brand.name}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-xs text-gray-300 italic">Not assigned</p>
                      )}
                    </div>

                    {/* Team — avatar grid for large teams */}
                    <div>
                      <h4 className="text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-3">
                        Team {team.length > 0 && <span className="text-gray-300 font-normal ml-1">({team.length})</span>}
                      </h4>
                      {team.length > 0 ? (
                        <>
                          <div className="flex flex-wrap gap-1.5">
                            {visibleTeam.map((m) => (
                              <div key={m.email} className="group/avatar relative" title={m.name}>
                                {m.avatar_url ? (
                                  <img src={m.avatar_url} alt={m.name} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm hover:shadow-md hover:scale-110 transition-all cursor-default" />
                                ) : (
                                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-semibold text-white border-2 border-white shadow-sm hover:shadow-md hover:scale-110 transition-all cursor-default" style={{ backgroundColor: brand.color }}>
                                    {m.name.charAt(0).toUpperCase()}
                                  </div>
                                )}
                                {/* Tooltip */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-[#304256] text-white text-[10px] rounded whitespace-nowrap opacity-0 group-hover/avatar:opacity-100 transition-opacity pointer-events-none z-10">
                                  {m.name}
                                </div>
                              </div>
                            ))}
                            {!showAllTeam && hasMore && (
                              <button
                                onClick={() => setShowAllTeam(true)}
                                className="w-9 h-9 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-[10px] font-medium text-gray-500 hover:bg-gray-200 transition-colors"
                              >
                                +{team.length - 12}
                              </button>
                            )}
                          </div>
                          {showAllTeam && hasMore && (
                            <button
                              onClick={() => setShowAllTeam(false)}
                              className="text-[11px] text-gray-400 hover:text-[#304256] mt-2 transition-colors"
                            >
                              Show less
                            </button>
                          )}
                        </>
                      ) : (
                        <p className="text-xs text-gray-300 italic">No team members registered yet</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    </AppShell>
  );
}
