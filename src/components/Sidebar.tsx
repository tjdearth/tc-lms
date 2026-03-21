"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const TC_LOGO_URL =
  "https://lh7-rt.googleusercontent.com/docsz/AD_4nXcuZ3fOJUGrPHzT0Tu5n3IyhjOPWYUjkhaEcBcNhdpt2I5hcRLGyL_Sj635ZffMbHWB3xfPa8vnDZ06Pfl0ez9vedO8hDGzYaZxhKsj7yyVeyk-sUcbBz4G6KXjTCvXUgo48Y2n?key=5z7x5EJrcuoubrabZrlshg";

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
];

interface SidebarProps {
  onSearchClick?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function Sidebar({ onSearchClick, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const userName = session?.user?.name || session?.user?.email?.split("@")[0] || "User";
  const userInitial = userName.charAt(0).toUpperCase();
  const userImage = session?.user?.image;

  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div
        className="px-5 py-5"
        style={{ borderBottom: "1px solid #2A3F52" }}
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src={TC_LOGO_URL}
            alt="Travel Collection"
            className="w-full h-auto"
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div
            className="text-[13px] font-bold tracking-wide uppercase text-center"
            style={{ color: "#27a28c" }}
          >
            Atlas
          </div>
        </div>
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
              backgroundColor: "#0F1923",
              border: "1px solid #2A3F52",
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
                  ? { backgroundColor: "#304256", color: "#E8EDF2", fontWeight: 600 }
                  : { color: "#8A9BB0" }
              }
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = "#E8EDF2";
                  e.currentTarget.style.backgroundColor = "rgba(48,66,86,0.3)";
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

      {/* User */}
      <div
        className="px-4 py-4"
        style={{ borderTop: "1px solid #2A3F52" }}
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
      className={`w-[240px] flex flex-col fixed top-0 left-0 bottom-0 z-50 transition-transform duration-200 ease-in-out md:translate-x-0 ${
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        backgroundColor: "#1A2A3A",
        borderRight: "1px solid #2A3F52",
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
