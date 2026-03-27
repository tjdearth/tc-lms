"use client";

import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";

// ── Demo Data ──────────────────────────────────────────────────────────────

const destinations = [
  { id: 1, name: "Italy", locations: 12, newWithoutAssets: 1 },
  { id: 2, name: "Spain", locations: 8, newWithoutAssets: 0 },
  { id: 3, name: "Portugal", locations: 4, newWithoutAssets: 1 },
  { id: 4, name: "Kenya", locations: 4, newWithoutAssets: 0 },
  { id: 5, name: "Tanzania", locations: 3, newWithoutAssets: 0 },
  { id: 6, name: "Uganda", locations: 2, newWithoutAssets: 1 },
  { id: 7, name: "Rwanda", locations: 2, newWithoutAssets: 0 },
  { id: 8, name: "Mexico", locations: 4, newWithoutAssets: 1 },
  { id: 9, name: "Indonesia", locations: 3, newWithoutAssets: 0 },
  { id: 10, name: "Singapore", locations: 1, newWithoutAssets: 0 },
  { id: 11, name: "Malaysia", locations: 2, newWithoutAssets: 0 },
  { id: 12, name: "UAE", locations: 2, newWithoutAssets: 0 },
  { id: 13, name: "UK", locations: 4, newWithoutAssets: 1 },
  { id: 14, name: "Japan", locations: 4, newWithoutAssets: 1 },
  { id: 15, name: "France", locations: 4, newWithoutAssets: 0 },
  { id: 16, name: "Australia", locations: 3, newWithoutAssets: 1 },
  { id: 17, name: "Thailand", locations: 2, newWithoutAssets: 0 },
  { id: 18, name: "Türkiye", locations: 2, newWithoutAssets: 1 },
  { id: 19, name: "Greece", locations: 1, newWithoutAssets: 0 },
  { id: 20, name: "Colombia", locations: 1, newWithoutAssets: 0 },
  { id: 21, name: "Peru", locations: 1, newWithoutAssets: 1 },
];

const locationsWithoutAssets = [
  { id: 24, name: "Madeira", destination: "Portugal" },
  { id: 62, name: "Great Barrier Reef", destination: "Australia" },
];

const servicesWithoutAssets = [
  { id: 1, name: "Private Chef Experience", type: "Experiences", supplier: "Local Chefs Co" },
  { id: 2, name: "Helicopter Transfer", type: "Transport", supplier: "SkyWay Aviation" },
  { id: 3, name: "Desert Safari", type: "Experiences", supplier: "Desert Adventures" },
  { id: 4, name: "Villa Rental - Tuscany", type: "Accommodation", supplier: "Luxury Villas" },
  { id: 5, name: "Wine Tasting Tour", type: "Experiences", supplier: "Vineyard Tours" },
  { id: 6, name: "Mountain Guide Service", type: "Guides", supplier: "Alpine Experts" },
];

const suppliersData = { total: 156, accommodation: 68, experiences: 52, transport: 24, guides: 12, newWithoutAssets: 8 };
const servicesData = { total: 423, accommodation: 187, experiences: 142, transport: 58, guides: 36, newWithoutAssets: 14 };

const sampleSupplier = {
  id: 1,
  name: "Palazzo Scanderbeg",
  type: "Accommodation",
  address: "Piazza Scanderbeg 117, 00187 Rome, Italy",
  city: "Rome",
  country: "Italy",
  starRating: 5,
  website: "https://www.palazzoscanderbeg.com",
  email: "info@palazzoscanderbeg.com",
  phone: "+39 06 8952 9001",
  description:
    "Hidden in a tiny piazza just streets away from the Trevi Fountain, Palazzo Scanderbeg is a magical 15th-century residence rich in history. Named after Albanian hero and prince George Castriot Scanderbeg who commissioned the Palace, this elegant Roman collection features modern, apartment-style suites and understated rooms.",
  gallery: [
    "https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-facciata.jpg",
    "https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-ingresso.jpg",
    "https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-libreria.jpg",
    "https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-butler.jpg",
    "https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-colazioni.jpg",
  ],
  services: [
    {
      id: 101, name: "Classic Room", type: "Room Category",
      description: "Clean, simple and understated rooms ideal for couples looking for a comfortable base from which to explore Rome. Features modern amenities including free WiFi, TV, air-conditioning, minibar, safe, and CO Bigelow bath products.",
      bedType: "Double", maxOccupancy: 2, size: "30 sqm",
      amenities: ["Free WiFi", "Air Conditioning", "Minibar", "Safe", "TV", "CO Bigelow Bath Products"],
      hasAssets: true,
      gallery: [
        "https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-classic.jpg",
        "https://cdn.blastness.biz/media/134/top/thumbs/full/Palazzo-Scanderbeg-top-classic.jpg",
      ],
    },
    {
      id: 102, name: "Deluxe Townhouse", type: "Room Category",
      description: "Bright and noble suite just steps from the Trevi Fountain. Unique for its original wooden floor and vaults, featuring design furnishings by famous Made in Italy signatures.",
      bedType: "King", maxOccupancy: 2, size: "70 sqm",
      amenities: ["Kitchen", "Espresso Machine", "Liquor Cabinet", "Free WiFi", "Air Conditioning", "Square Views"],
      hasAssets: true,
      gallery: ["https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-deluxe-suite.jpg"],
    },
    {
      id: 103, name: "Annex Suite", type: "Room Category",
      description: "Large suites decorated in a palette of brown, navy blue and white with Venetian-wood floors, exposed wooden beams and views of Scanderbeg Square.",
      bedType: "King + Sofa Bed", maxOccupancy: 4, size: "70-106 sqm",
      amenities: ["Kitchen", "Dining Area", "Sofa Bed", "Hammam Shower", "Free WiFi", "Exposed Beams"],
      hasAssets: true,
      gallery: ["https://cdn.blastness.biz/media/134/gallery/thumbs/full/gallery-App_Annex_Living_and_Kitchen_02.jpg"],
    },
    {
      id: 104, name: "The Victory Suite", type: "Room Category",
      description: "Set over two floors with 120 sqm of space, this magnificent suite features mid-century decor with Venetian-wood floors, orange-leather furnishings and white walls.",
      bedType: "King + Sofa Bed", maxOccupancy: 4, size: "120 sqm",
      amenities: ["Two Floors", "Butler Service", "Full Kitchen", "Mid-Century Decor", "Venetian Floors"],
      hasAssets: true,
      gallery: ["https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-the-victory-suite01.jpg"],
    },
    {
      id: 105, name: "The Scanderbeg Suite", type: "Room Category",
      description: "This bright and exclusive suite on the fourth floor takes its name from Albanian hero George Castriot Scanderbeg. Features original high white wooden vaults from the 15th century.",
      bedType: "King (2 bedrooms)", maxOccupancy: 4, size: "127 sqm",
      amenities: ["Private Roof Terrace", "Butler Service", "15th-Century Vaults", "Two Bedrooms", "Two Ensuites"],
      hasAssets: true,
      gallery: [
        "https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-scanderbeg-suite-living.jpg",
        "https://cdn.blastness.biz/media/134/top/thumbs/full/Palazzo-Scanderbeg-top-scanderbeg-suite-camera.jpg",
      ],
    },
    {
      id: 106, name: "The Ambassador Suite", type: "Room Category",
      description: "One of a kind, this magnificent 166 sqm suite spans three floors with a private terrace overlooking Roman rooftops. Features a wellness turret with private hammam shower.",
      bedType: "King + Queen + Sofa", maxOccupancy: 6, size: "166 sqm",
      amenities: ["Private Terrace", "Wellness Turret", "Hammam Shower", "Technogym Bike", "Butler Service", "3 Floors"],
      hasAssets: true,
      gallery: ["https://cdn.blastness.biz/media/134/gallery/thumbs/full/Palazzo-Scanderbeg-gallery-ambassador-suite-camera.jpg"],
    },
    {
      id: 107, name: "Private Chef Dinner", type: "Experience",
      description: "Enjoy an intimate dining experience in the privacy of your suite with a private chef preparing authentic Italian cuisine.",
      maxOccupancy: 8, duration: "3-4 hours",
      amenities: ["Private Chef", "Multi-course Menu", "Wine Pairing Available", "In-Suite Dining"],
      hasAssets: false, gallery: [],
    },
    {
      id: 108, name: "Nonna's Home Cooking Class", type: "Experience",
      description: "Learn to prepare authentic Roman cuisine with a real Italian grandmother. Hands-on cooking class teaches traditional recipes.",
      maxOccupancy: 6, duration: "4 hours",
      amenities: ["Hands-on Cooking", "Traditional Recipes", "Meal Included", "Recipe Cards"],
      hasAssets: false, gallery: [],
    },
    {
      id: 109, name: "Private Vatican Tour", type: "Experience",
      description: "Skip the lines with an exclusive private tour of the Vatican Museums, Sistine Chapel, and St. Peter's Basilica.",
      maxOccupancy: 8, duration: "3 hours",
      amenities: ["Skip-the-Line Access", "Private Guide", "Sistine Chapel", "St. Peter's Basilica"],
      hasAssets: false, gallery: [],
    },
  ],
};

// ── Icons ──────────────────────────────────────────────────────────────────

function GlobeIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
function MapPinIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  );
}
function UsersIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function BriefcaseIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function AlertIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function ArrowLeftIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${open ? "rotate-180" : ""}`}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function LockIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
function BedIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 4v16" /><path d="M2 8h18a2 2 0 0 1 2 2v10" /><path d="M2 17h20" /><path d="M6 8v2a2 2 0 0 0 2 2h0a2 2 0 0 0 2-2V8" />
    </svg>
  );
}
function SparklesIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}
function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1" className={filled ? "text-amber-400" : "text-gray-300"}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-[#27a28c]">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

// ── Nav items for left panel ───────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg> },
  { id: "divider-1", label: "Content", divider: true },
  { id: "faq", label: "FAQ", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>, count: 21 },
  { id: "destinations", label: "Destinations", icon: <GlobeIcon />, count: 21 },
  { id: "locations", label: "Locations", icon: <MapPinIcon />, count: 67 },
  { id: "suppliers", label: "Suppliers", icon: <UsersIcon />, count: 156 },
  { id: "services", label: "Services", icon: <BriefcaseIcon />, count: 423 },
  { id: "divider-2", label: "Assets", divider: true },
  { id: "media", label: "Media Library", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>, count: 12 },
  { id: "content-blocks", label: "Content Blocks", icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>, count: 8 },
];

// ── Service Card ───────────────────────────────────────────────────────────

interface ServiceType {
  id: number; name: string; type: string; description: string;
  bedType?: string; maxOccupancy: number; size?: string; duration?: string;
  amenities: string[]; hasAssets: boolean; gallery: string[];
}

function ServiceCard({ service, expanded, onToggle }: { service: ServiceType; expanded: boolean; onToggle: () => void }) {
  const isRoom = service.type === "Room Category";
  const hasAllAssets = service.hasAssets && service.gallery.length > 0;

  return (
    <div className={`rounded-xl border transition-all ${hasAllAssets ? "border-[#27a28c]/30 bg-[#27a28c]/5" : "border-amber-400/30 bg-amber-50"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50/50 rounded-t-xl transition-colors">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${isRoom ? "bg-blue-100" : "bg-purple-100"}`}>
            {isRoom ? <BedIcon className="text-blue-600" /> : <SparklesIcon className="text-purple-600" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#304256]">{service.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${isRoom ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700"}`}>{service.type}</span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {isRoom ? `${service.bedType} · ${service.maxOccupancy} guests · ${service.size}` : `${service.maxOccupancy} guests · ${service.duration}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!hasAllAssets && (
            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-medium rounded-lg flex items-center gap-1">
              <AlertIcon className="text-amber-600" /> Missing Assets
            </span>
          )}
          <ChevronIcon open={expanded} />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          <div className="pt-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Description</label>
            <textarea defaultValue={service.description} rows={3} className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c] resize-none" />
          </div>
          <div className="grid grid-cols-4 gap-3">
            {isRoom ? (
              <>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Bed Type</label>
                  <input type="text" defaultValue={service.bedType} className="w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Max Occupancy</label>
                  <input type="number" defaultValue={service.maxOccupancy} className="w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Room Size</label>
                  <input type="text" defaultValue={service.size} className="w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Amenities</label>
                  <input type="text" defaultValue={service.amenities.join(", ")} className="w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Max Guests</label>
                  <input type="number" defaultValue={service.maxOccupancy} className="w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30" />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Duration</label>
                  <input type="text" defaultValue={service.duration} className="w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">Includes</label>
                  <input type="text" defaultValue={service.amenities.join(", ")} className="w-full px-3 py-2 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30" />
                </div>
              </>
            )}
          </div>
          {/* Gallery */}
          {service.gallery.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {service.gallery.map((img, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-28 h-20 object-cover rounded-lg border border-[#E8ECF1]" />
                  <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          {/* Upload zone */}
          <div className="border-2 border-dashed border-[#E8ECF1] rounded-xl p-5 hover:border-[#27a28c]/40 transition-colors cursor-pointer group text-center">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-[#27a28c]/10 transition-colors">
                <UploadIcon />
              </div>
              <p className="text-xs text-gray-500">Drop files here or click to upload</p>
              <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, MP4 up to 50MB</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Supplier Editor ────────────────────────────────────────────────────────

function SupplierEditor({ supplier, onBack }: { supplier: typeof sampleSupplier; onBack: () => void }) {
  const [expandedServices, setExpandedServices] = useState<number[]>([supplier.services[0]?.id]);
  const toggleService = (id: number) => setExpandedServices((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  const missingCount = supplier.services.filter((s) => !s.hasAssets || !s.gallery?.length).length;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeftIcon />
          </button>
          <div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-0.5">
              <span>Suppliers</span>
              <span>/</span>
              <span>Accommodation</span>
              <span>/</span>
              <span className="text-[#304256] font-medium">{supplier.name}</span>
            </div>
            <h1 className="text-xl font-bold text-[#304256]">{supplier.name}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {missingCount > 0 && (
            <span className="px-3 py-1.5 bg-amber-50 text-amber-700 text-xs font-medium rounded-lg flex items-center gap-1.5 border border-amber-200">
              <AlertIcon className="text-amber-600" />
              {missingCount} service{missingCount > 1 ? "s" : ""} missing assets
            </span>
          )}
          <button className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:from-violet-500 hover:to-purple-500 transition-all shadow-sm">
            <SparklesIcon className="text-white" /> Create with AI
          </button>
          <button className="px-4 py-2 bg-[#304256] text-white rounded-lg text-sm font-semibold hover:bg-[#304256]/90 transition-colors">
            Save
          </button>
        </div>
      </div>

      {/* Supplier Info */}
      <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#E8A838]/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#E8A838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#304256]">Supplier Information</h2>
            <p className="text-xs text-gray-400">Hotel details and property content</p>
          </div>
        </div>

        {/* SF Sync notice */}
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-lg mb-5">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
          <span className="text-xs text-blue-600">Some fields synced from Salesforce</span>
          <LockIcon />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">Hotel Name <LockIcon /></label>
                <input type="text" value={supplier.name} readOnly className="w-full px-3 py-2.5 bg-gray-50 border border-[#E8ECF1] rounded-lg text-sm text-gray-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">Star Rating</label>
                <div className="flex items-center gap-0.5 py-2">
                  {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} filled={s <= supplier.starRating} />)}
                  <span className="text-xs text-gray-400 ml-1">{supplier.starRating}-Star</span>
                </div>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">Address <LockIcon /></label>
              <input type="text" value={supplier.address} readOnly className="w-full px-3 py-2.5 bg-gray-50 border border-[#E8ECF1] rounded-lg text-sm text-gray-400 cursor-not-allowed" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">City <LockIcon /></label>
                <div className="px-3 py-2.5 bg-gray-50 border border-[#E8ECF1] rounded-lg text-sm text-gray-400">{supplier.city}</div>
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">Country <LockIcon /></label>
                <div className="px-3 py-2.5 bg-gray-50 border border-[#E8ECF1] rounded-lg text-sm text-gray-400">{supplier.country}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">Website <LockIcon /></label>
                <input type="url" value={supplier.website} readOnly className="w-full px-3 py-2.5 bg-gray-50 border border-[#E8ECF1] rounded-lg text-xs text-gray-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-1">Phone <LockIcon /></label>
                <input type="tel" value={supplier.phone} readOnly className="w-full px-3 py-2.5 bg-gray-50 border border-[#E8ECF1] rounded-lg text-xs text-gray-400 cursor-not-allowed" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1 block">About / Description</label>
              <textarea defaultValue={supplier.description} rows={5} className="w-full px-3 py-2.5 border border-[#E8ECF1] rounded-lg text-sm text-[#304256] focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c] resize-none" />
            </div>
          </div>

          {/* Gallery */}
          <div>
            <label className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Property Gallery</label>
            <div className="flex gap-2 flex-wrap mb-3">
              {supplier.gallery.map((img, i) => (
                <div key={i} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-28 h-20 object-cover rounded-lg border border-[#E8ECF1]" />
                  <button className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="border-2 border-dashed border-[#E8ECF1] rounded-xl p-6 hover:border-[#27a28c]/40 transition-colors cursor-pointer group text-center">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mb-2 group-hover:bg-[#27a28c]/10 transition-colors">
                  <UploadIcon />
                </div>
                <p className="text-xs text-gray-500">Drop files here or click to upload</p>
                <p className="text-[10px] text-gray-400 mt-0.5">PNG, JPG, MP4 up to 50MB</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services */}
      <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-[#27a28c]/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27a28c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
          </div>
          <div>
            <h2 className="text-base font-semibold text-[#304256]">Services</h2>
            <p className="text-xs text-gray-400">Room categories and experiences offered</p>
          </div>
        </div>
        <div className="space-y-3">
          {supplier.services.map((svc) => (
            <ServiceCard key={svc.id} service={svc} expanded={expandedServices.includes(svc.id)} onToggle={() => toggleService(svc.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

function Dashboard({ onViewSupplier }: { onViewSupplier: () => void }) {
  const destWithAlerts = destinations.filter((d) => d.newWithoutAssets > 0).length;

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#304256]">Level II Asset Dashboard</h1>
        <p className="text-sm text-gray-400 mt-0.5">Overview of your travel content library</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        {/* Destinations */}
        <div className="bg-white border border-[#E8ECF1] rounded-xl p-5 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center mb-3">
            <GlobeIcon className="text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-[#304256]">{destinations.length}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">Destinations</p>
          {destWithAlerts > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertIcon className="text-amber-600" />
              <span className="text-[10px] text-amber-700 font-medium">{destWithAlerts} new without assets</span>
            </div>
          )}
        </div>

        {/* Locations */}
        <div className="bg-white border border-[#E8ECF1] rounded-xl p-5 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center mb-3">
            <MapPinIcon className="text-cyan-600" />
          </div>
          <p className="text-3xl font-bold text-[#304256]">67</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-3">Locations</p>
          {locationsWithoutAssets.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertIcon className="text-amber-600" />
              <span className="text-[10px] text-amber-700 font-medium">{locationsWithoutAssets.length} new without assets</span>
            </div>
          )}
        </div>

        {/* Suppliers */}
        <button onClick={onViewSupplier} className="bg-white border border-[#E8ECF1] rounded-xl p-5 shadow-sm text-left hover:border-[#27a28c]/40 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center mb-3">
            <UsersIcon className="text-amber-600" />
          </div>
          <p className="text-3xl font-bold text-[#304256]">{suppliersData.total}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-2">Suppliers</p>
          <div className="space-y-1 text-[11px] mb-2">
            <div className="flex justify-between"><span className="text-gray-400">Accommodation</span><span className="text-[#304256]">{suppliersData.accommodation}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Experiences</span><span className="text-[#304256]">{suppliersData.experiences}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Transport</span><span className="text-[#304256]">{suppliersData.transport}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Guides</span><span className="text-[#304256]">{suppliersData.guides}</span></div>
          </div>
          {suppliersData.newWithoutAssets > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertIcon className="text-amber-600" />
              <span className="text-[10px] text-amber-700 font-medium">{suppliersData.newWithoutAssets} new without assets</span>
            </div>
          )}
        </button>

        {/* Services */}
        <div className="bg-white border border-[#E8ECF1] rounded-xl p-5 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-[#27a28c]/10 flex items-center justify-center mb-3">
            <BriefcaseIcon className="text-[#27a28c]" />
          </div>
          <p className="text-3xl font-bold text-[#304256]">{servicesData.total}</p>
          <p className="text-xs text-gray-400 mt-0.5 mb-2">Services</p>
          <div className="space-y-1 text-[11px] mb-2">
            <div className="flex justify-between"><span className="text-gray-400">Accommodation</span><span className="text-[#304256]">{servicesData.accommodation}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Experiences</span><span className="text-[#304256]">{servicesData.experiences}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Transport</span><span className="text-[#304256]">{servicesData.transport}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Guides</span><span className="text-[#304256]">{servicesData.guides}</span></div>
          </div>
          {servicesData.newWithoutAssets > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
              <AlertIcon className="text-amber-600" />
              <span className="text-[10px] text-amber-700 font-medium">{servicesData.newWithoutAssets} new without assets</span>
            </div>
          )}
        </div>
      </div>

      {/* All Destinations */}
      <div className="bg-white border border-[#E8ECF1] rounded-xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-[#304256] mb-3">All Destinations</h3>
        <div className="flex flex-wrap gap-2">
          {destinations.map((d) => (
            <span key={d.id} className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${d.newWithoutAssets > 0 ? "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
              {d.name}
              {d.newWithoutAssets > 0 && <span className="ml-1 text-amber-500">·</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Locations Requiring Assets */}
      {locationsWithoutAssets.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
              <AlertIcon className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-amber-800 mb-2">Locations Requiring Assets</h3>
              <div className="flex flex-wrap gap-2">
                {locationsWithoutAssets.map((loc) => (
                  <span key={loc.id} className="px-3 py-1.5 bg-amber-100 rounded-lg text-xs text-amber-800 border border-amber-200">
                    {loc.name} <span className="text-amber-500">({loc.destination})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Requiring Assets */}
      {servicesWithoutAssets.length > 0 && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-100 flex items-center justify-center flex-shrink-0">
              <AlertIcon className="text-cyan-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-cyan-800 mb-2">Services Requiring Assets</h3>
              <div className="flex flex-wrap gap-2">
                {servicesWithoutAssets.map((svc) => (
                  <span key={svc.id} className="px-3 py-1.5 bg-cyan-100 rounded-lg text-xs text-cyan-800 border border-cyan-200 cursor-pointer hover:bg-cyan-200 transition-colors">
                    {svc.name} <span className="text-cyan-500">({svc.type})</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────

function LevelIIContent() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [editingSupplier, setEditingSupplier] = useState(false);

  // Resizable panel
  const [panelWidth, setPanelWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (!isResizing) return;
    const onMouseMove = (e: MouseEvent) => {
      const sidebarOffset = 240; // AppShell sidebar width
      const newWidth = Math.min(Math.max(e.clientX - sidebarOffset, 200), 400);
      setPanelWidth(newWidth);
    };
    const onMouseUp = () => setIsResizing(false);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] md:h-screen" style={{ marginLeft: 0 }}>
      <div className="flex flex-1 min-h-0">
        {/* Left navigation panel */}
        <div className="hidden md:flex bg-white border-r border-gray-200 flex-col h-full flex-shrink-0" style={{ width: `${panelWidth}px` }}>
          {/* Header */}
          <div className="px-4 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#E8A838]/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#E8A838" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </div>
              <h2 className="text-sm font-bold text-[#304256]">Level II Content</h2>
            </div>
          </div>

          {/* Nav items */}
          <nav className="flex-1 overflow-y-auto px-2 pb-4">
            {navItems.map((item) => {
              if ("divider" in item && item.divider) {
                return (
                  <div key={item.id} className="pt-4 pb-1.5 px-3">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                  </div>
                );
              }

              const isActive = activeNav === item.id && !editingSupplier;
              const isSupplierActive = item.id === "suppliers" && editingSupplier;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveNav(item.id);
                    setEditingSupplier(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all my-0.5"
                  style={{
                    borderRadius: isActive || isSupplierActive ? "0 999px 999px 0" : "6px",
                    backgroundColor: isActive || isSupplierActive ? "#27a28c" : "transparent",
                    color: isActive || isSupplierActive ? "#ffffff" : "#4a5568",
                    fontWeight: isActive || isSupplierActive ? 600 : 400,
                    marginLeft: isActive || isSupplierActive ? "-8px" : "0",
                    width: isActive || isSupplierActive ? "calc(100% + 8px)" : "100%",
                    paddingLeft: isActive || isSupplierActive ? "20px" : "12px",
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span className="flex-1 text-[13px]">{item.label}</span>
                  {"count" in item && item.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive || isSupplierActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Resize handle */}
        <div onMouseDown={() => setIsResizing(true)} className="hidden md:block group relative w-0 flex-shrink-0 cursor-col-resize" style={{ zIndex: 10 }}>
          <div className="absolute inset-y-0 -left-2 w-4 group-hover:bg-[#27a28c]/10" />
          <div className="absolute inset-y-0 left-0 w-px bg-gray-200 group-hover:bg-[#27a28c]/60" />
        </div>

        {/* Right content panel */}
        <div className="flex-1 overflow-y-auto bg-[#f9fafb]">
          {editingSupplier ? (
            <SupplierEditor supplier={sampleSupplier} onBack={() => setEditingSupplier(false)} />
          ) : (
            <Dashboard onViewSupplier={() => setEditingSupplier(true)} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function LevelIIPage() {
  return (
    <AppShell>
      <LevelIIContent />
    </AppShell>
  );
}
