"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Loader2Icon, UserRoundPenIcon } from "lucide-react"

import { updateUser, useSession } from "@/src/lib/auth-client"
import { isValidPhotoSource } from "@/src/lib/photo"
import { PhotoField } from "../components/photo-field"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { Button } from "../components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "../components/ui/field"
import { Input } from "../components/ui/input"
import { Skeleton } from "../components/ui/skeleton"
import { toast } from "../components/ui/toast"

type ProfileUser = {
  name: string
  email: string
  image?: string | null
}

function getInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("")

  return initials || "H"
}

function ProfileForm({ user }: { user: ProfileUser }) {
  const router = useRouter()
  const [name, setName] = useState(user.name)
  const [image, setImage] = useState(user.image ?? "")
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const previewImage = image.trim()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const nextName = name.trim()
    const nextImage = image.trim()

    if (!nextName) {
      const message = "Please enter your display name."
      setError(message)
      toast.add({ type: "error", title: "Name required", description: message })
      return
    }

    if (nextImage && !isValidPhotoSource(nextImage)) {
      const message =
        "Choose an uploaded image or enter a photo URL starting with http:// or https://."
      setError(message)
      toast.add({
        type: "error",
        title: "Invalid photo",
        description: message,
      })
      return
    }

    setSaving(true)

    try {
      const result = await updateUser({
        name: nextName,
        image: nextImage || null,
      })

      if (result?.error) {
        const message =
          result.error.message || "Could not update your profile. Try again."
        setError(message)
        toast.add({
          type: "error",
          title: "Profile not updated",
          description: message,
        })
        return
      }

      toast.add({
        type: "success",
        title: "Profile updated",
        description: "Your name and photo have been saved.",
      })
      router.refresh()
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Could not update your profile. Try again."
      setError(message)
      toast.add({
        type: "error",
        title: "Profile not updated",
        description: message,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <Avatar className="size-16">
          {previewImage ? (
            <AvatarImage
              src={previewImage}
              alt={name || "Profile photo"}
              referrerPolicy="no-referrer"
            />
          ) : null}
          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-700 text-lg font-bold text-white">
            {getInitials(name || user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-base font-bold text-emerald-950 dark:text-white">
            {name || user.name}
          </p>
          <p className="truncate text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="profile-name">Display name</FieldLabel>
            <Input
              id="profile-name"
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
              required
              className="h-10"
            />
            <FieldDescription>
              This is the name shown on events you create and join.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="profile-image">Profile photo</FieldLabel>
            <PhotoField
              id="profile-image"
              value={image}
              onChange={setImage}
              fallbackName={name || user.name}
              disabled={saving}
              showPreview={false}
              onError={(message) => setError(message)}
            />
            <FieldDescription>
              Upload a photo from your device or paste a public image link.
              Leave empty to use your initials.
            </FieldDescription>
          </Field>

          {error ? <FieldError>{error}</FieldError> : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" size="lg" disabled={saving}>
              {saving ? (
                <>
                  <Loader2Icon className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <UserRoundPenIcon />
                  Save changes
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={saving}
              onClick={() => {
                setName(user.name)
                setImage(user.image ?? "")
                setError(null)
              }}
            >
              Reset
            </Button>
          </div>
        </FieldGroup>
      </form>
    </div>
  )
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()

  const sessionUser = session?.user ?? null
  const user: ProfileUser | null = sessionUser
    ? {
        name: sessionUser.name,
        email: sessionUser.email,
        image: sessionUser.image,
      }
    : null

  useEffect(() => {
    if (!isPending && !sessionUser) {
      router.replace("/login")
    }
  }, [isPending, sessionUser, router])

  return (
    <div className="mx-auto my-10 w-full max-w-xl px-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Your profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Update the name and photo other volunteers see across Hermineo.
        </p>
      </div>

      {isPending ? (
        <div className="rounded-2xl border p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-4">
            <Skeleton className="size-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      ) : user ? (
        <ProfileForm user={user} />
      ) : (
        <div className="rounded-2xl border p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">
            You need to be logged in to edit your profile.
          </p>
          <Button
            size="lg"
            className="mt-4"
            render={<Link href="/login" />}
          >
            Go to login
          </Button>
        </div>
      )}
    </div>
  )
}
