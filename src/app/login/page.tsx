"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader2Icon } from "lucide-react"

import { signIn } from "@/src/lib/auth-client"
import { Button } from "../components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import { toast } from "../components/ui/toast"

function GoogleIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.86c2.26-2.08 3.58-5.15 3.58-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.29v3.09A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.29a7.2 7.2 0 0 1 0-4.58V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.61 4.59 1.8l3.42-3.42A11.98 11.98 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  function showError(message: string) {
    setError(message)
    toast.add({
      type: "error",
      title: "Sign in failed",
      description: message,
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      await signIn.email(
        { email, password },
        {
          onSuccess: () => {
            toast.add({
              type: "success",
              title: "Welcome back!",
              description: "You are signed in. Redirecting to your events...",
            })
            router.push("/")
          },
          onError: (ctx) => {
            showError(
              ctx.error.message || "Invalid email or password. Please try again."
            )
          },
        }
      )
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError(null)
    setGoogleLoading(true)

    try {
      await signIn.social(
        { provider: "google", callbackURL: "/" },
        {
          onError: (ctx) => {
            showError(
              ctx.error.message ||
                "Could not sign you in with Google. Please try again."
            )
            setGoogleLoading(false)
          },
        }
      )
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Could not sign you in with Google. Please try again."
      )
      setGoogleLoading(false)
    }
  }

  const busy = loading || googleLoading

  return (
    <div className="mx-auto my-10 w-full max-w-md px-4">
      <div className="rounded-2xl border p-6 shadow-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to create events and track the causes you care about.
          </p>
        </div>

        <FieldGroup>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={busy}
          >
            {googleLoading ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <GoogleIcon />
            )}
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </Button>

          <FieldSeparator>or continue with email</FieldSeparator>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <Input
                id="login-email"
                type="email"
                name="email"
                placeholder="name@example.com"
                autoComplete="email"
                required
                className="h-10"
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <Input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="h-10"
              />
              <FieldDescription>
                Must contain uppercase, lowercase, and at least 6 characters.
              </FieldDescription>
            </Field>

            {error && (
              <p
                role="alert"
                className="text-sm text-red-600 dark:text-red-400"
              >
                {error}
              </p>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={busy}>
              {loading ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold underline underline-offset-4"
            >
              Sign up
            </Link>
          </p>
        </FieldGroup>
      </div>
    </div>
  )
}
