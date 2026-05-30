"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50">
      <div className="sc-mist">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-baseline gap-3">
            <Link
              href="/"
              className="sc-link-fade sc-medieval sc-metal-text text-xl text-white/90"
            >
              Relicware
            </Link>
            <div className="text-[11px] tracking-[0.26em] text-white/50 uppercase">
              Control the divine
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/codex" className="sc-btn">
              Codex
            </Link>
            <Link href="/behind-the-scenes" className="sc-btn">
              BTS
            </Link>
            <Link href="/experience" className="sc-btn sc-btn-primary">
              Begin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="py-10 text-sm text-white/60">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="sc-overlay px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="sc-kicker text-xs text-white/70">Relicware</div>
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/codex" className="sc-link-fade">
                Codex
              </Link>
              <Link
                href="/behind-the-scenes"
                className="sc-link-fade"
              >
                Behind the scenes
              </Link>
              <Link
                href="/experience"
                className="sc-link-fade"
              >
                Pilgrimage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function SiteChrome({ children }) {
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const isExperience = pathname?.startsWith("/experience");

  if (isLanding || isExperience) return children;

  return (
    <div className="sc-screen min-h-full">
      <SiteHeader />
      <div className="flex min-h-full flex-col">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
