"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { isAdmin, isCourseCreator } from "@/lib/admin";
import { useBrand } from "@/lib/brand-context";
import { BRAND_NAMES } from "@/lib/brands";

interface UserPermissions {
  isGlobalAdmin: boolean;
  isGlobalCourseCreator: boolean;
  gmForBrand: string | null;
}


const navItems = [
  {
    label: "Home",
    href: "/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Company",
    href: "/company",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    label: "Wiki",
    href: "/wiki",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    label: "Calendar",
    href: "/calendar",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: "Learn",
    href: "/learn",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5" />
      </svg>
    ),
  },
  {
    label: "DMC Dashboard",
    href: "/dmc-dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: "Ask Atlas AI",
    href: "/ask",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l2.09 6.26L20 10l-5.91 1.74L12 18l-2.09-6.26L4 10l5.91-1.74L12 2z" />
        <path d="M20 16l1 3.09L24 20l-3 .91L20 24l-1-3.09L16 20l3-.91L20 16z" />
      </svg>
    ),
  },
];

interface SidebarProps {
  onSearchClick?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ onSearchClick, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const { brand, userDmcBrand, setBrandMode } = useBrand();
  const isTc = brand.mode === "tc";
  const isDmc = !isTc;
  const [permissions, setPermissions] = useState<UserPermissions | null>(null);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session?.user?.image;
  const userEmail = session?.user?.email || "";
  const globalAdmin = isAdmin(userEmail);
  const globalCourseCreator = isCourseCreator(userEmail);

  // GM check: show admin links when in their DMC mode
  const isGmForCurrentBrand = permissions?.gmForBrand && isDmc && permissions.gmForBrand === brand.mode;
  const showWikiAdmin = globalAdmin || !!isGmForCurrentBrand;
  const showCourseAdmin = globalCourseCreator || !!isGmForCurrentBrand;

  useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/auth/permissions")
        .then((r) => r.json())
        .then((data) => setPermissions(data))
        .catch(() => {});
    }
  }, [session?.user?.email]);

  const adminItems = [
    ...(showWikiAdmin ? [{
      label: "Wiki Admin",
      href: "/wiki/admin",
      icon: (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    }] : []),
    ...(showCourseAdmin ? [
      {
        label: "Course Admin",
        href: "/learn/admin",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
          </svg>
        ),
      },
      {
        label: "Micro-Learning",
        href: "/learn/admin/micro-learning",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        ),
      },
      {
        label: "Analytics",
        href: "/learn/analytics",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        ),
      },
    ] : []),
    ...(globalAdmin ? [
      {
        label: "User Access",
        href: "/admin/users",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
          </svg>
        ),
      },
      {
        label: "Level II",
        href: "/admin/level-ii",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
          </svg>
        ),
      },
      {
        label: "Sales Enablement",
        href: "/admin/sales-enablement",
        icon: (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        ),
      },
    ] : []),
  ];

  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: `1px solid ${brand.sidebarBorder}` }}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-full h-[120px] flex items-center justify-center flex-shrink-0">
            <img
              src={brand.logo}
              alt={brand.name}
              style={{ filter: "brightness(0) invert(1)", maxWidth: "100%", maxHeight: "120px", objectFit: "contain" }}
            />
          </div>
          <div
            className="text-[13px] font-bold tracking-wide uppercase text-center"
            style={{ color: isTc ? brand.accent : brand.sidebarIsDark ? "#E8EDF2" : "#304256" }}
          >
            Atlas
          </div>
        </div>

        {/* Brand toggle */}
        <div className="mt-2 mx-auto flex rounded-full overflow-hidden h-[22px] w-[100px]" style={{ border: `1px solid ${brand.sidebarBorder}` }}>
          <button
            onClick={() => { setBrandMode("tc"); setShowBrandDropdown(false); }}
            className="flex-1 text-[9px] font-semibold tracking-wider text-center transition-colors"
            style={{
              backgroundColor: isTc ? brand.accent : "transparent",
              color: isTc ? "#fff" : "#8A9BB0",
            }}
          >
            TC
          </button>
          <button
            onClick={() => {
              if (globalAdmin) {
                // Admins get a dropdown to pick any DMC
                setShowBrandDropdown(!showBrandDropdown);
              } else if (userDmcBrand) {
                setBrandMode(userDmcBrand);
              }
            }}
            className="flex-1 text-[9px] font-semibold tracking-wider text-center transition-colors"
            style={{
              backgroundColor: !isTc ? brand.accent : "transparent",
              color: !isTc ? "#fff" : "#8A9BB0",
            }}
          >
            DMC
          </button>
        </div>

        {/* Admin brand dropdown */}
        {globalAdmin && showBrandDropdown && (
          <div
            className="mt-1 mx-auto rounded-lg overflow-hidden max-h-[200px] overflow-y-auto"
            style={{ backgroundColor: brand.sidebarActiveBg, border: `1px solid ${brand.sidebarBorder}`, width: "180px" }}
          >
            {BRAND_NAMES.map((bName) => (
              <button
                key={bName}
                onClick={() => { setBrandMode(bName); setShowBrandDropdown(false); }}
                className="w-full text-left px-3 py-1.5 text-[11px] transition-colors"
                style={{
                  color: brand.mode === bName ? "#fff" : "#8A9BB0",
                  backgroundColor: brand.mode === bName ? brand.accent : "transparent",
                }}
                onMouseEnter={(e) => { if (brand.mode !== bName) e.currentTarget.style.color = "#E8EDF2"; }}
                onMouseLeave={(e) => { if (brand.mode !== bName) e.currentTarget.style.color = "#8A9BB0"; }}
              >
                {bName}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Search */}
      <div className="px-3 pt-3">
        <div className="relative">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-2.5 top-1/2 -translate-y-1/2"
            style={{ color: "#8A9BB0" }}
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <button
            onClick={() => {
              onSearchClick?.();
              handleNavClick();
            }}
            className="w-full text-left pl-8 pr-7 py-2 rounded-lg text-[12px]"
            style={{
              backgroundColor: isTc ? "#0F1923" : "#1A0810",
              border: `1px solid ${brand.sidebarBorder}`,
              color: "#8A9BB0",
            }}
          >
            Search everything...
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="px-3 py-3 flex-1 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
              style={
                active
                  ? { backgroundColor: brand.sidebarActiveBg, color: "#E8EDF2", fontWeight: 600 }
                  : { color: "#8A9BB0" }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "#E8EDF2";
                  e.currentTarget.style.backgroundColor = `${brand.sidebarActiveBg}4D`;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "#8A9BB0";
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin / Tools */}
      {adminItems.length > 0 && (
        <div className="px-3 pb-2">
          <div style={{ borderTop: `1px solid ${brand.sidebarBorder}` }} className="pt-3 mb-1">
            <span className="px-3 text-[10px] font-semibold uppercase tracking-widest" style={{ color: "#6B7D8F" }}>
              {showWikiAdmin || showCourseAdmin ? "Admin" : "Tools"}
            </span>
          </div>
          <div className="space-y-0.5">
            {adminItems.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-[13px] transition-all duration-150"
                  style={
                    active
                      ? { backgroundColor: brand.sidebarActiveBg, color: "#E8EDF2", fontWeight: 600 }
                      : { color: "#8A9BB0" }
                  }
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "#E8EDF2";
                      e.currentTarget.style.backgroundColor = `${brand.sidebarActiveBg}4D`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.color = "#8A9BB0";
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* User */}
      <div
        className="px-4 py-4"
        style={{ borderTop: `1px solid ${brand.sidebarBorder}` }}
      >
        {session?.user ? (
          <div className="flex items-center gap-2.5">
            {userImage ? (
              <Image src={userImage} alt={userName} width={32} height={32} className="rounded-full" />
            ) : (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{ backgroundColor: "#304256", color: "#E8EDF2" }}
              >
                {userInitial}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span className="text-[13px] font-semibold truncate block" style={{ color: "#E8EDF2" }}>
                {userName}
              </span>
              <span className="text-[11px] truncate block" style={{ color: "#8A9BB0" }}>
                Admin &middot; Travel Collection HQ
              </span>
            </div>
            <button
              onClick={async () => { await signOut({ redirect: false }); window.location.href = "/login"; }}
              className="cursor-pointer flex-shrink-0"
              style={{ color: "#8A9BB0" }}
              title="Sign out"
              onMouseEnter={(e) => { e.currentTarget.style.color = "#E8EDF2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "#8A9BB0"; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <span className="text-[10px] tracking-wide" style={{ color: "rgba(232,237,242,0.3)" }}>
            Travel Collection
          </span>
        )}
      </div>
    </>
  );

  return (
    <aside
      className={`w-[240px] flex flex-col fixed top-0 left-0 bottom-0 z-[70] transition-transform duration-200 ease-in-out md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        backgroundColor: brand.sidebarBg,
        borderRight: `1px solid ${brand.sidebarBorder}`,
      }}
    >
      {/* Mobile close button */}
      <button
        onClick={onMobileClose}
        className="md:hidden absolute top-4 right-4 z-10 cursor-pointer"
        style={{ color: "#8A9BB0" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#E8EDF2"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#8A9BB0"; }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
      {sidebarContent}
    </aside>
  );
}
