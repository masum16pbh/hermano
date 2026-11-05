import { createAuthClient } from "better-auth/react"

/**
 * A single Better Auth client instance. Requests go to `/api/auth` on the
 * current origin, so the same build works locally and in production.
 */
export const authClient = createAuthClient()

export const { signIn, signUp, signOut, useSession, updateUser } = authClient
