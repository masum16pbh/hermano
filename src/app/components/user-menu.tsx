"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import {
  CalendarCheckIcon,
  CalendarCogIcon,
  CalendarPlusIcon,
  ChevronDownIcon,
  Loader2Icon,
  LogOutIcon,
  UserRoundPenIcon,
} from "lucide-react"

import { signOut } from "@/src/lib/auth-client"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Skeleton } from "./ui/skeleton"
import { toast } from "./ui/toast"

export type SessionUser = {
  name: string
  email: string
  image?: string | null
}

type UserMenuProps = {
  user: SessionUser | null
  isPending?: boolean
  /** Show only the avatar. Used in the compact mobile navbar. */
  compact?: boolean
}

const accountLinks = [
  { href: "/profile", label: "Edit profile", icon: UserRoundPenIcon },
  { href: "/events/create", label: "Add event", icon: CalendarPlusIcon },
  { href: "/events/manage", label: "Manage events", icon: CalendarCogIcon },
  { href: "/events/joined", label: "My joined events", icon: CalendarCheckIcon },
] as const

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "H"
}

function useSignOut() {
  const router = useRouter()
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    if (signingOut) return
    setSigningOut(true)

    try {
      const result = await signOut()

      if (result?.error) {
        toast.add({
          type: "error",
          title: "Could not sign out",
          description:
            result.error.message || "Something went wrong. Please try again.",
        })
        return
      }

      toast.add({
        type: "success",
        title: "Signed out",
        description: "You have been logged out of Hermineo.",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      toast.add({
        type: "error",
        title: "Could not sign out",
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setSigningOut(false)
    }
  }

  return { signingOut, handleSignOut }
}

function UserAvatar({
  user,
  size = "size-9",
}: {
  user: SessionUser
  size?: string
}) {
  return (
    <Avatar className={`${size} shrink-0`}>
      {user.image ? (
        <AvatarImage
          src={user.image}
          alt={user.name}
          referrerPolicy="no-referrer"
        />
      ) : null}
      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-700 text-xs font-bold text-white">
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

function AccountLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      {accountLinks.map((link) => {
        const Icon = link.icon

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-emerald-950/75 transition hover:bg-emerald-50 hover:text-emerald-900 dark:text-emerald-50/75 dark:hover:bg-white/10 dark:hover:text-white"
          >
            <Icon className="size-4 shrink-0" aria-hidden="true" />
            {link.label}
          </Link>
        )
      })}
    </>
  )
}

function SignOutButton({
  signingOut,
  onSignOut,
  className = "",
}: {
  signingOut: boolean
  onSignOut: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onSignOut}
      disabled={signingOut}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50 focus-visible:bg-rose-50 focus-visible:outline-none disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-500/10 dark:focus-visible:bg-rose-500/10 ${className}`}
    >
      {signingOut ? (
        <Loader2Icon className="size-4 animate-spin" aria-hidden="true" />
      ) : (
        <LogOutIcon className="size-4" aria-hidden="true" />
      )}
      {signingOut ? "Signing out..." : "Log out"}
    </button>
  )
}

export function UserMenu({
  user,
  isPending = false,
  compact = false,
}: UserMenuProps) {
  const { signingOut, handleSignOut } = useSignOut()

  if (isPending) {
    return (
      <Skeleton className="size-9 rounded-full bg-emerald-950/10 dark:bg-white/10" />
    )
  }

  if (!user) {
    if (compact) return null

    return (
      <Link
        href="/login"
        className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:-translate-y-0.5 hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
      >
        Log in
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Open profile menu for ${user.name}`}
        title={user.name}
        className="group flex items-center gap-2.5 rounded-full border border-emerald-950/10 bg-white/70 py-1.5 pl-1.5 pr-2.5 text-left shadow-sm transition hover:border-emerald-600/25 hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 data-popup-open:border-emerald-600/25 data-popup-open:bg-emerald-50 dark:border-white/10 dark:bg-white/5 dark:hover:border-emerald-400/25 dark:hover:bg-white/10 dark:data-popup-open:border-emerald-400/25 dark:data-popup-open:bg-white/10"
      >
        <UserAvatar user={user} />
        <span
          className={
            compact
              ? "hidden"
              : "hidden max-w-28 truncate text-sm font-bold text-emerald-950 sm:block dark:text-white"
          }
        >
          {user.name}
        </span>
        <ChevronDownIcon
          className={
            compact
              ? "hidden"
              : "hidden size-4 text-emerald-950/45 transition-transform duration-200 group-data-popup-open:rotate-180 sm:block dark:text-white/45"
          }
          aria-hidden="true"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 rounded-2xl bg-white p-2 shadow-2xl shadow-emerald-950/10 ring-1 ring-emerald-950/10 dark:bg-[#0a1a13] dark:text-emerald-50 dark:shadow-black/40 dark:ring-white/10"
      >
        <div className="px-2 pb-2 pt-1.5">
          <p className="truncate text-sm font-bold text-emerald-950 dark:text-white">
            {user.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-emerald-950/55 dark:text-emerald-50/55">
            {user.email}
          </p>
        </div>

        <DropdownMenuSeparator className="bg-emerald-950/10 dark:bg-white/10" />

        {accountLinks.map((link) => {
          const Icon = link.icon

          return (
            <DropdownMenuItem
              key={link.href}
              render={<Link href={link.href} />}
              className="gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold text-emerald-950/75 focus:bg-emerald-50 focus:text-emerald-900 dark:text-emerald-50/75 dark:focus:bg-white/10 dark:focus:text-white"
            >
              <Icon aria-hidden="true" />
              {link.label}
            </DropdownMenuItem>
          )
        })}

        <DropdownMenuSeparator className="bg-emerald-950/10 dark:bg-white/10" />

        <DropdownMenuItem
          variant="destructive"
          onClick={handleSignOut}
          className="gap-3 rounded-xl px-2 py-2.5 text-sm font-semibold dark:text-rose-300 dark:focus:bg-rose-500/10 dark:focus:text-rose-200"
        >
          {signingOut ? (
            <Loader2Icon className="animate-spin" aria-hidden="true" />
          ) : (
            <LogOutIcon aria-hidden="true" />
          )}
          {signingOut ? "Signing out..." : "Log out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/** Account block rendered inside the mobile navigation panel. */
export function MobileAccountPanel({
  user,
  isPending = false,
  onNavigate,
}: {
  user: SessionUser | null
  isPending?: boolean
  onNavigate?: () => void
}) {
  const { signingOut, handleSignOut } = useSignOut()

  if (isPending) {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 dark:bg-white/5">
        <Skeleton className="size-10 rounded-full bg-emerald-950/10 dark:bg-white/10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24 bg-emerald-950/10 dark:bg-white/10" />
          <Skeleton className="h-3 w-36 bg-emerald-950/10 dark:bg-white/10" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="space-y-3">
        <Link
          href="/login"
          onClick={onNavigate}
          className="flex h-11 w-full items-center justify-center rounded-full bg-emerald-700 px-5 text-sm font-bold text-white shadow-sm shadow-emerald-900/20 transition hover:bg-emerald-800"
        >
          Log in
        </Link>
        <p className="text-center text-xs font-medium text-emerald-950/55 dark:text-emerald-50/55">
          New to Hermineo?{" "}
          <Link
            href="/signup"
            onClick={onNavigate}
            className="font-bold text-emerald-700 underline-offset-4 hover:underline dark:text-emerald-300"
          >
            Create an account
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-3 dark:bg-white/5">
        <UserAvatar user={user} size="size-10" />
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
        <AccountLinks onNavigate={onNavigate} />
      </nav>

      <div
        aria-hidden="true"
        className="h-px bg-emerald-950/10 dark:bg-white/10"
      />

      <SignOutButton
        signingOut={signingOut}
        onSignOut={() => {
          onNavigate?.()
          void handleSignOut()
        }}
      />
    </div>
  )
}
