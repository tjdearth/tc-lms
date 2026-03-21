"use client";

import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface DmcBrand {
  name: string;
  color: string;
  countries: string[];
  markers: { city: string; lat: number; lon: number }[];
}

const DMC_BRANDS: DmcBrand[] = [
  {
    name: "Authenticus Italy",
    color: "#C6B356",
    countries: ["Italy"],
    markers: [{ city: "Milan", lat: 45.46, lon: 9.19 }],
  },
  {
    name: "Unbox Spain & Portugal",
    color: "#7C1137",
    countries: ["Spain", "Portugal"],
    markers: [{ city: "Madrid", lat: 40.42, lon: -3.7 }],
  },
  {
    name: "Truly Swahili",
    color: "#4F9E2D",
    countries: ["Kenya", "United Republic of Tanzania", "Tanzania", "Uganda", "Rwanda"],
    markers: [{ city: "Arusha", lat: -3.39, lon: 36.68 }],
  },
  {
    name: "Across Mexico",
    color: "#E56456",
    countries: ["Mexico"],
    markers: [{ city: "Mexico City", lat: 19.43, lon: -99.13 }],
  },
  {
    name: "Kembali Indonesia",
    color: "#ADA263",
    countries: ["Indonesia", "Singapore", "Malaysia"],
    markers: [{ city: "Bali", lat: -8.34, lon: 115.09 }],
  },
  {
    name: "Majlis Retreats",
    color: "#B28A72",
    countries: ["United Arab Emirates"],
    markers: [{ city: "Dubai", lat: 25.2, lon: 55.27 }],
  },
  {
    name: "Crown Journey",
    color: "#6D7581",
    countries: ["United Kingdom"],
    markers: [{ city: "London", lat: 51.51, lon: -0.13 }],
  },
  {
    name: "Oshinobi Travel",
    color: "#E9395E",
    countries: ["Japan"],
    markers: [{ city: "Tokyo", lat: 35.68, lon: 139.65 }],
  },
  {
    name: "Essentially French",
    color: "#58392E",
    countries: ["France"],
    markers: [{ city: "Paris", lat: 48.86, lon: 2.35 }],
  },
  {
    name: "Elura Australia",
    color: "#B04D32",
    countries: ["Australia"],
    markers: [{ city: "Adelaide", lat: -34.93, lon: 138.6 }],
  },
  {
    name: "Nira Thailand",
    color: "#636218",
    countries: ["Thailand"],
    markers: [{ city: "Bangkok", lat: 13.76, lon: 100.5 }],
  },
  {
    name: "Sar Turkiye",
    color: "#247F82",
    countries: ["Turkey"],
    markers: [{ city: "Istanbul", lat: 41.01, lon: 28.98 }],
  },
  {
    name: "Nostos Greece",
    color: "#0E1952",
    countries: ["Greece"],
    markers: [{ city: "Athens", lat: 37.98, lon: 23.73 }],
  },
  {
    name: "Vista Colombia",
    color: "#FEE9A8",
    countries: ["Colombia"],
    markers: [{ city: "Bogota", lat: 4.71, lon: -74.07 }],
  },
  {
    name: "Awaken Peru",
    color: "#95AFA2",
    countries: ["Peru"],
    markers: [{ city: "Lima", lat: -12.05, lon: -77.04 }],
  },
  {
    name: "Experience Morocco",
    color: "#F56A23",
    countries: ["Morocco"],
    markers: [{ city: "Marrakech", lat: 31.63, lon: -7.98 }],
  },
];

// Build lookup: country name → { color, brand }
const countryLookup: Record<string, { color: string; brand: string }> = {};
DMC_BRANDS.forEach((b) => {
  b.countries.forEach((c) => {
    countryLookup[c] = { color: b.color, brand: b.name };
  });
});

// All markers
const allMarkers = DMC_BRANDS.flatMap((b) =>
  b.markers.map((m) => ({ ...m, brand: b.name, color: b.color }))
);

export default function DmcWorldMap() {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    brand: string;
    country: string;
    color: string;
  } | null>(null);

  return (
    <div className="bg-white rounded-xl border border-[#E8ECF1] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#E8ECF1] flex items-center justify-between">
        <h2 className="text-base font-semibold text-[#304256] flex items-center gap-2">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Our Global Presence
        </h2>
        <span className="text-[11px] text-gray-400">
          16 DMC brands across 22 countries
        </span>
      </div>

      {/* Map */}
      <div
        className="relative"
        style={{ backgroundColor: "#F8FAFB" }}
        onMouseLeave={() => setTooltip(null)}
      >
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 130,
            center: [20, 20],
          }}
          width={900}
          height={440}
          style={{ width: "100%", height: "auto" }}
        >
          <ZoomableGroup zoom={1.25} center={[20, 20]}>
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const name = geo.properties.name;
                  const match = countryLookup[name];
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={match ? match.color : "#E2E8F0"}
                      stroke="#fff"
                      strokeWidth={0.5}
                      style={{
                        default: {
                          outline: "none",
                          opacity: match ? 0.85 : 0.6,
                        },
                        hover: {
                          outline: "none",
                          opacity: 1,
                          fill: match ? match.color : "#CBD5E1",
                          cursor: match ? "pointer" : "default",
                        },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={(e) => {
                        if (match) {
                          const rect = (
                            e.currentTarget.closest("svg") as SVGSVGElement
                          )?.getBoundingClientRect();
                          if (rect) {
                            setTooltip({
                              x: e.clientX - rect.left,
                              y: e.clientY - rect.top - 10,
                              brand: match.brand,
                              country: name,
                              color: match.color,
                            });
                          }
                        }
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                  );
                })
              }
            </Geographies>

            {/* Office markers */}
            {allMarkers.map((m) => (
              <Marker key={m.city} coordinates={[m.lon, m.lat]}>
                <circle r={3} fill="#fff" stroke={m.color} strokeWidth={1.5} />
                <circle r={1.2} fill={m.color} />
              </Marker>
            ))}
          </ZoomableGroup>
        </ComposableMap>

        {/* Tooltip */}
        {tooltip && (
          <div
            className="absolute pointer-events-none z-10 px-3 py-2 rounded-lg shadow-lg border border-[#E8ECF1] bg-white"
            style={{
              left: tooltip.x,
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: tooltip.color }}
              />
              <span className="text-xs font-semibold text-[#304256]">
                {tooltip.brand}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5 pl-[18px]">
              {tooltip.country}
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="px-5 py-4 border-t border-[#E8ECF1] bg-gray-50/50">
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {DMC_BRANDS.map((b) => (
            <div key={b.name} className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: b.color }}
              />
              <span className="text-[11px] text-gray-500 font-medium">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
