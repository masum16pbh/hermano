"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useSession } from "@/src/lib/auth-client";
import { ThemeToggle } from "./theme-toggle";
import { MobileAccountPanel, UserMenu, type SessionUser } from "./user-menu";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming events" },
] as const;

function LogoMark() {
  return (
    <svg
      className="size-6"
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M16 27.2c-4.9-3-8.6-6.7-8.6-11.2 0-3.6 2.3-6 5.5-6 1.4 0 2.5.5 3.1 1.5.7-1 1.8-1.5 3.2-1.5 3.2 0 5.5 2.4 5.5 6 0 4.5-3.7 8.2-8.7 11.2Z"
        fill="currentColor"
      />
      <path
        d="M11.8 17.1c1.4.1 3.1.8 4.2 2.2 1.1-1.4 2.8-2.1 4.2-2.2"
        stroke="#065f46"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      className="size-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      {open ? (
        <path d="m6 6 12 12M18 6 6 18" />
      ) : (
        <path d="M4 7h16M4 12h16M4 17h16" />
      )}
    </svg>
  );
}

export function Navbar() {
  const { data: session, isPending } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const user: SessionUser | null = session?.user
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  useEffect(() => {
    if (!mobileOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMobileOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  function closeMenus() {
    setMobileOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-950/10 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#05110c]/85">
      <div
        aria-hidden="true"
        className="h-0.5 w-full bg-gradient-to-r from-emerald-600 via-teal-400 to-lime-300"
      />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:h-[4.5rem] sm:px-6 lg:px-8">
        <Link
          href="/"
          onClick={closeMenus}
          className="group flex shrink-0 items-center gap-3 rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-600"
        >
          <span className="relative grid size-10 place-items-center overflow-hidden rounded-[0.9rem] bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800 text-white shadow-lg shadow-emerald-900/20 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <span
              aria-hidden="true"
              className="absolute -right-2.5 -top-2.5 size-7 rounded-full bg-white/15"
            />
            <LogoMark />
          </span>

          <span className="flex flex-col leading-none">
            <span className="text-[1.05rem] font-black tracking-[-0.04em] text-emerald-950 dark:text-white">
              Hermineo
            </span>
            <span className="mt-1 text-[0.55rem] font-bold uppercase tracking-[0.24em] text-emerald-700/75 dark:text-emerald-300/75">
              Community in action
            </span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-emerald-950/65 transition hover:bg-emerald-100/70 hover:text-emerald-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:text-emerald-50/65 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <ThemeToggle />

          <span
            aria-hidden="true"
            className="mx-1 h-6 w-px bg-emerald-950/10 dark:bg-white/10"
          />

          <UserMenu user={user} isPending={isPending} />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <UserMenu user={user} isPending={isPending} compact />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={
              mobileOpen ? "Close navigation menu" : "Open navigation menu"
            }
            className="grid size-10 place-items-center rounded-full border border-emerald-950/10 bg-white/60 text-emerald-950/75 shadow-sm transition hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-white/10 dark:bg-white/5 dark:text-emerald-50/75 dark:hover:bg-white/10"
          >
            <MenuIcon open={mobileOpen} />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-emerald-950/10 bg-white/95 backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-[#06130e]/95"
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <nav aria-label="Mobile navigation" className="grid gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenus}
                  className="rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-950/75 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-emerald-50/75 dark:hover:bg-white/10 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div
              aria-hidden="true"
              className="my-3 h-px bg-emerald-950/10 dark:bg-white/10"
            />

            <MobileAccountPanel
              user={user}
              isPending={isPending}
              onNavigate={closeMenus}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
