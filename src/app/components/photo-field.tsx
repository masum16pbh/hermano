"use client"

import { useId, useRef, useState } from "react"
import { ImagePlusIcon, Loader2Icon, Trash2Icon } from "lucide-react"

import {
  createPhotoDataUrl,
  isPhotoDataUrl,
  MAX_PHOTO_FILE_MB,
} from "@/src/lib/photo"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

type PhotoFieldProps = {
  value: string
  onChange: (value: string) => void
  /** Id applied to the image URL input so a FieldLabel can point at it. */
  id?: string
  /** Name used to render initials when there is no photo. */
  fallbackName?: string
  disabled?: boolean
  /** Hide the avatar preview when the page already shows one. */
  showPreview?: boolean
  onError?: (message: string) => void
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

export function PhotoField({
  value,
  onChange,
  id,
  fallbackName = "",
  disabled = false,
  showPreview = true,
  onError,
}: PhotoFieldProps) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trimmed = value.trim()
  const uploadedPhoto = isPhotoDataUrl(trimmed)

  function reportError(message: string) {
    setError(message)
    onError?.(message)
  }

  function clearError() {
    setError(null)
  }

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    // Reset so selecting the same file again still fires a change event.
    event.target.value = ""

    if (!file) return

    clearError()
    setProcessing(true)

    try {
      const dataUrl = await createPhotoDataUrl(file)
      onChange(dataUrl)
    } catch (err) {
      reportError(
        err instanceof Error ? err.message : "Could not use that image."
      )
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        {showPreview ? (
          <Avatar className="size-16">
            {trimmed ? (
              <AvatarImage
                src={trimmed}
                alt={fallbackName || "Profile photo"}
                referrerPolicy="no-referrer"
              />
            ) : null}
            <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-700 text-lg font-bold text-white">
              {getInitials(fallbackName)}
            </AvatarFallback>
          </Avatar>
        ) : null}

        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={disabled || processing}
          onClick={() => fileInputRef.current?.click()}
        >
          {processing ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <ImagePlusIcon />
          )}
          {processing
            ? "Processing..."
            : trimmed
              ? "Change photo"
              : "Upload photo"}
        </Button>

        {trimmed ? (
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={disabled || processing}
            onClick={() => {
              clearError()
              onChange("")
            }}
          >
            <Trash2Icon />
            Remove
          </Button>
        ) : null}

        <input
          ref={fileInputRef}
          id={`${fieldId}-file`}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="sr-only"
          disabled={disabled || processing}
          onChange={handleFileChange}
        />
      </div>

      <Input
        id={fieldId}
        type="text"
        inputMode="url"
        value={uploadedPhoto ? "" : value}
        placeholder="Or paste an image link: https://example.com/photo.jpg"
        autoComplete="photo"
        aria-label="Photo URL"
        disabled={disabled || processing}
        onChange={(event) => {
          clearError()
          onChange(event.target.value)
        }}
        className="h-10"
      />

      <p className="text-xs text-muted-foreground">
        JPG, PNG, WebP, or GIF up to {MAX_PHOTO_FILE_MB} MB. Uploads are cropped
        to a square. You can also paste a public image link.
      </p>

      {uploadedPhoto ? (
        <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
          Uploaded photo is ready to save. Paste a link to replace it.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
