"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { signUp } from "@/src/lib/auth-client"
import { isValidPhotoSource } from "@/src/lib/photo"
import { PhotoField } from "../components/photo-field"
import { Button } from "../components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import { toast } from "../components/ui/toast"

export default function SignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  function showError(message: string) {
    setError(message)
    toast.add({
      type: "error",
      title: "Sign up failed",
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
    const nextImage = image.trim()

    // Password validation per requirements: uppercase, lowercase, length >= 6
    if (password.length < 6) {
      showError("Password must be at least 6 characters long")
      setLoading(false)
      return
    }
    if (!/[A-Z]/.test(password)) {
      showError("Password must contain at least one uppercase letter")
      setLoading(false)
      return
    }
    if (!/[a-z]/.test(password)) {
      showError("Password must contain at least one lowercase letter")
      setLoading(false)
      return
    }
    if (nextImage && !isValidPhotoSource(nextImage)) {
      showError(
        "Choose an uploaded image or enter a photo URL starting with http:// or https://."
      )
      setLoading(false)
      return
    }

    try {
      await signUp.email(
        {
          email,
          password,
          name: name.trim(),
          image: nextImage || undefined,
        },
        {
          onSuccess: () => {
            toast.add({
              type: "success",
              title: "Account created",
              description: "Welcome to Hermineo! You are now signed in.",
            })
            router.push("/")
          },
          onError: (ctx) => {
            showError(ctx.error.message || "Failed to sign up")
          },
        }
      )
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to sign up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto my-10 w-full max-w-md px-4">
      <form
        onSubmit={handleSubmit}
        onReset={() => {
          setName("")
          setImage("")
          setError(null)
        }}
        className="rounded-2xl border p-6 shadow-sm"
      >
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="fieldgroup-name">Name</FieldLabel>
            <Input
              id="fieldgroup-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Jordan Lee"
              autoComplete="name"
              required
              className="h-10"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-email">Email</FieldLabel>
            <Input
              id="fieldgroup-email"
              type="email"
              name="email"
              placeholder="name@example.com"
              autoComplete="email"
              required
              className="h-10"
            />
            <FieldDescription>
              We&apos;ll send updates to this address.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-image">Profile photo</FieldLabel>
            <PhotoField
              id="fieldgroup-image"
              value={image}
              onChange={setImage}
              fallbackName={name}
              disabled={loading}
              onError={setError}
            />
            <FieldDescription>
              Optional. Upload a photo from your device or paste a public image
              link. Leave empty to use your initials.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="fieldgroup-password">Password</FieldLabel>
            <Input
              id="fieldgroup-password"
              name="password"
              type="password"
              placeholder="Enter password"
              autoComplete="new-password"
              required
              className="h-10"
            />
            <FieldDescription>
              Must contain uppercase, lowercase, and at least 6 characters.
            </FieldDescription>
          </Field>
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          <Field orientation="horizontal">
            <Button type="reset" variant="outline">
              Reset
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "Sign up"}
            </Button>
          </Field>
          <p className="text-sm text-center">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </p>
        </FieldGroup>
      </form>
    </div>
  )
}
