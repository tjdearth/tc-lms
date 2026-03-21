"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  const handleNavClick = () => {
    if (onMobileClose) onMobileClose();
  };

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 w-[220px] bg-navy flex flex-col z-[70] transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Logo */}
      <div className="px-5 pt-5 pb-2 flex items-center justify-between">
        <img
          src="https://lh7-rt.googleusercontent.com/docsz/AD_4nXcuZ3fOJUGrPHzT0Tu5n3IyhjOPWYUjkhaEcBcNhdpt2I5hcRLGyL_Sj635ZffMbHWB3xfPa8vnDZ06Pfl0ez9vedO8hDGzYaZxhKsj7yyVeyk-sUcbBz4G6KXjTCvXUgo48Y2n?key=5z7x5EJrcuoubrabZrlshg"
          alt="Travel Collection"
          className="h-[40px] w-auto"
        />
        {/* Close button on mobile */}
        <button
          onClick={onMobileClose}
          className="md:hidden text-white/60 hover:text-white p-1"
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* App name in teal */}
      <div className="px-5 pb-4">
        <span className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#27a28c" }}>
          ATLAS
        </span>
      </div>

      {/* Prominent search bar */}
      <div className="px-3 pb-4">
        <button
          onClick={() => {
            onSearchClick?.();
            handleNavClick();
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors bg-white/10 hover:bg-white/15 text-white/50 hover:text-white/70"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <span>Search everything...</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-white/15 text-white font-medium"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom */}
      <div className="px-5 py-4 border-t border-white/10">
        <span className="text-[10px] text-white/30 tracking-wide">
          Travel Collection
        </span>
      </div>
    </aside>
  );
}
