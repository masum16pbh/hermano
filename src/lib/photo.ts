/**
 * Helpers for profile photos.
 *
 * Uploaded files are resized in the browser and stored as a small JPEG data
 * URL on the user's `image` field, so no extra file-storage service is needed
 * and the photo behaves exactly like the one Google provides at sign-in.
 */

export const MAX_PHOTO_FILE_MB = 8
export const MAX_PHOTO_FILE_BYTES = MAX_PHOTO_FILE_MB * 1024 * 1024

const PHOTO_OUTPUT_SIZE = 256
const PHOTO_DATA_URL_PATTERN =
  /^data:image\/(?:png|jpe?g|webp|gif);base64,/i

export function isPhotoDataUrl(value: string) {
  return PHOTO_DATA_URL_PATTERN.test(value.trim())
}

/** Accepts an empty value, an uploaded image data URL, or an http(s) URL. */
export function isValidPhotoSource(value: string) {
  const trimmed = value.trim()

  if (!trimmed) return true
  if (isPhotoDataUrl(trimmed)) return true

  try {
    const url = new URL(trimmed)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () =>
      reject(new Error("That file could not be read as an image."))
    image.src = src
  })
}

/**
 * Turns a user-selected file into a square, 256px JPEG data URL. This keeps
 * the stored value small enough to travel with the session payload.
 */
export async function createPhotoDataUrl(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Choose an image file (JPG, PNG, WebP, or GIF).")
  }

  if (file.type === "image/svg+xml") {
    throw new Error(
      "SVG images are not supported. Choose a JPG, PNG, WebP, or GIF instead."
    )
  }

  if (file.size > MAX_PHOTO_FILE_BYTES) {
    throw new Error(`Choose an image smaller than ${MAX_PHOTO_FILE_MB} MB.`)
  }

  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await loadImage(objectUrl)

    if (!image.width || !image.height) {
      throw new Error("That image could not be processed.")
    }

    const canvas = document.createElement("canvas")
    canvas.width = PHOTO_OUTPUT_SIZE
    canvas.height = PHOTO_OUTPUT_SIZE

    const context = canvas.getContext("2d")

    if (!context) {
      throw new Error("Your browser could not process this image.")
    }

    // White backdrop so transparent PNGs do not turn black in the JPEG.
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, PHOTO_OUTPUT_SIZE, PHOTO_OUTPUT_SIZE)

    // Crop to a centred square ("cover" fit).
    const scale = Math.max(
      PHOTO_OUTPUT_SIZE / image.width,
      PHOTO_OUTPUT_SIZE / image.height
    )
    const width = image.width * scale
    const height = image.height * scale

    context.drawImage(
      image,
      (PHOTO_OUTPUT_SIZE - width) / 2,
      (PHOTO_OUTPUT_SIZE - height) / 2,
      width,
      height
    )

    return canvas.toDataURL("image/jpeg", 0.85)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
