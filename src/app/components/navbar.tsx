"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ThemeToggle } from "./theme-toggle";


export type NavbarUser = {
  name: string;
  email: string;
  image?: string | null;
};

type NavbarProps = {
  user?: NavbarUser | null;
  onSignOut?: () => void;
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming events" },
] as const;

const accountLinks = [
  { href: "/events/create", label: "Create event", icon: "create" },
  { href: "/events/manage", label: "Manage events", icon: "manage" },
  { href: "/events/joined", label: "Joined events", icon: "joined" },
] as const;

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "H";
}

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

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5.5 7.75 4.5 4.5 4.5-4.5" />
    </svg>
  );
}

function AccountIcon({ icon }: { icon: (typeof accountLinks)[number]["icon"] }) {
  if (icon === "create") {
    return (
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
    );
  }

  if (icon === "manage") {
    return (
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M4 7h10M18 7h2M4 17h2M10 17h10" />
        <circle cx="16" cy="7" r="2" />
        <circle cx="8" cy="17" r="2" />
      </svg>
    );
  }

  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3.5" y="5.5" width="17" height="15" rx="3" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 10h17M8.5 14.5l2.2 2.2 4.8-4.8" />
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

function Avatar({
  user,
  size = "size-9",
}: {
  user: NavbarUser;
  size?: string;
}) {
  if (user.image) {
    return (
      <Image
        src={user.image}
        alt=""
        width={40}
        height={40}
        unoptimized
        className={`${size} rounded-full object-cover ring-2 ring-white dark:ring-emerald-950`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`${size} grid place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-xs font-bold text-white ring-2 ring-white dark:ring-emerald-950`}
    >
      {getInitials(user.name)}
    </span>
  );
}

function SignOutButton({
  onSignOut,
  menuItem = false,
}: {
  onSignOut: () => void;
  menuItem?: boolean;
}) {
  return (
    <button
      type="button"
      role={menuItem ? "menuitem" : undefined}
      onClick={onSignOut}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:bg-rose-50 focus-visible:outline-none dark:text-rose-300 dark:hover:bg-rose-500/10 dark:focus-visible:bg-rose-500/10"
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
      </svg>
      Log out
    </button>
  );
}

export function Navbar({ user = null, onSignOut }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const profileId = useId();

  useEffect(() => {
    if (!profileOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setProfileOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

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
    setProfileOpen(false);
  }

  function handleSignOut() {
    setProfileOpen(false);
    setMobileOpen(false);
    onSignOut?.();
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

          {user ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-controls={profileId}
                className="group flex items-center gap-2.5 rounded-full border border-emerald-950/10 bg-white/70 py-1.5 pl-1.5 pr-3 text-left shadow-sm transition hover:border-emerald-600/25 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-400/25 dark:hover:bg-white/10"
              >
                <Avatar user={user} />
                <span className="max-w-28 truncate text-sm font-bold text-emerald-950 dark:text-white">
                  {user.name}
                </span>
                <ChevronIcon
                  className={`size-4 text-emerald-950/45 transition-transform duration-200 dark:text-white/45 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen ? (
                <div
                  id={profileId}
                  role="menu"
                  aria-label="Account menu"
                  className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-emerald-950/10 bg-white p-2 shadow-2xl shadow-emerald-950/10 dark:border-white/10 dark:bg-[#0a1a13] dark:shadow-black/40"
                >
                  <div className="px-3 pb-3 pt-2">
                    <p className="truncate text-sm font-bold text-emerald-950 dark:text-white">
                      {user.name}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-emerald-950/55 dark:text-emerald-50/55">
                      {user.email}
                    </p>
                  </div>

                  <div
                    aria-hidden="true"
                    className="mb-1 h-px bg-emerald-950/10 dark:bg-white/10"
                  />

                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      role="menuitem"
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-950/75 transition hover:bg-emerald-50 hover:text-emerald-900 focus-visible:bg-emerald-50 focus-visible:outline-none dark:text-emerald-50/75 dark:hover:bg-white/10 dark:hover:text-white dark:focus-visible:bg-white/10"
                    >
                      <AccountIcon icon={link.icon} />
                      {link.label}
                    </Link>
                  ))}

                  {onSignOut ? (
                    <>
                      <div
                        aria-hidden="true"
                        className="my-1 h-px bg-emerald-950/10 dark:bg-white/10"
                      />
                      <SignOutButton onSignOut={handleSignOut} menuItem />
                    </>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Log in
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
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

            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 dark:bg-white/5">
                  <Avatar user={user} size="size-10" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-emerald-950 dark:text-white">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-emerald-950/55 dark:text-emerald-50/55">
                      {user.email}
                    </p>
                  </div>
                </div>

                <nav aria-label="Account navigation" className="grid gap-1">
                  {accountLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMenus}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-950/75 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-emerald-50/75 dark:hover:bg-white/10 dark:hover:text-white"
                    >
                      <AccountIcon icon={link.icon} />
                      {link.label}
                    </Link>
                  ))}
                </nav>

                {onSignOut ? <SignOutButton onSignOut={handleSignOut} /> : null}
              </div>
            ) : (
              <div className="space-y-3">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="flex h-11 w-full items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800"
                >
                  Log in
                </Link>
                <p className="text-center text-xs font-medium text-emerald-950/55 dark:text-emerald-50/55">
                  New to Hermineo?{" "}
                  <Link
                    href="/register"
                    onClick={closeMenus}
                    className="font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
