import { NextResponse } from "next/server"
import { del, put } from "@vercel/blob"
import { createRemoteJWKSet, jwtVerify } from "jose"

import { GALLERY_ADMIN_EMAILS } from "@/lib/galleryAdmins"

// Photo uploads for the shared gallery (website + HCF app), stored in Vercel Blob.
//
//   POST   multipart form with "file"  → { url, pathname }
//   DELETE JSON { url }                 → { ok: true }
//
// Every request must carry the signed-in person's Firebase ID token
// ("Authorization: Bearer <token>"). The token is checked against Google's public keys,
// and only GALLERY_ADMIN_EMAILS may upload or delete. Needs BLOB_READ_WRITE_TOKEN, which
// Vercel adds automatically when a Blob store is connected to this project.

export const runtime = "nodejs"

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "hcfprod"
const GOOGLE_KEYS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"),
)
const MAX_BYTES = 4 * 1024 * 1024 // Vercel functions accept request bodies up to ~4.5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const EXT: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" }

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type",
}

const fail = (status: number, error: string) => NextResponse.json({ error }, { status, headers: corsHeaders })

async function requireAdmin(request: Request): Promise<string | NextResponse> {
  const header = request.headers.get("authorization") || ""
  const token = header.startsWith("Bearer ") ? header.slice(7) : ""
  if (!token) return fail(401, "Please sign in again.")
  try {
    const { payload } = await jwtVerify(token, GOOGLE_KEYS, {
      issuer: `https://securetoken.google.com/${FIREBASE_PROJECT_ID}`,
      audience: FIREBASE_PROJECT_ID,
    })
    const email = String(payload.email || "").toLowerCase()
    if (!GALLERY_ADMIN_EMAILS.includes(email)) return fail(403, "This account can't change the gallery.")
    return email
  } catch {
    return fail(401, "Your sign-in has expired. Please sign in again.")
  }
}

// Blob stores authenticate in one of two ways:
//  - newer stores: BLOB_STORE_ID + Vercel's built-in OIDC token (handled by @vercel/blob itself)
//  - older stores: BLOB_READ_WRITE_TOKEN (or <PREFIX>_BLOB_READ_WRITE_TOKEN)
const blobToken = () =>
  process.env.BLOB_READ_WRITE_TOKEN ||
  Object.entries(process.env).find(([key, value]) => key.endsWith("BLOB_READ_WRITE_TOKEN") && value)?.[1] ||
  undefined
const blobReady = () => !!(process.env.BLOB_STORE_ID || blobToken())
// Only pass a token when there is one; otherwise let @vercel/blob use OIDC + BLOB_STORE_ID.
const blobAuth = () => (blobToken() ? { token: blobToken() } : {})

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}

export async function POST(request: Request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin
  if (!blobReady()) return fail(500, "Photo storage isn't connected yet (Vercel → Storage → Blob, then redeploy).")

  let file: File | null = null
  try {
    const form = await request.formData()
    const value = form.get("file")
    file = value instanceof File ? value : null
  } catch {
    return fail(400, "No photo received.")
  }
  if (!file) return fail(400, "No photo received.")
  if (!ALLOWED_TYPES.includes(file.type)) return fail(415, "Please upload a JPG, PNG, WebP or GIF photo.")
  if (file.size > MAX_BYTES) return fail(413, "That photo is too large (max 4 MB).")

  try {
    const blob = await put(`gallery/${Date.now()}.${EXT[file.type] || "jpg"}`, file, {
      access: "public",
      contentType: file.type,
      addRandomSuffix: true,
      ...blobAuth(),
    })
    return NextResponse.json({ url: blob.url, pathname: blob.pathname }, { headers: corsHeaders })
  } catch (error) {
    console.error("Gallery upload failed:", error)
    return fail(500, `Upload failed: ${(error as Error)?.message || "please try again."}`)
  }
}

export async function DELETE(request: Request) {
  const admin = await requireAdmin(request)
  if (admin instanceof NextResponse) return admin
  if (!blobReady()) return fail(500, "Photo storage isn't connected yet.")

  const { url } = await request.json().catch(() => ({ url: "" }))
  let host = ""
  try {
    host = new URL(String(url)).hostname
  } catch {
    // invalid URL
  }
  // Only ever delete files from our own Blob store.
  if (!host.endsWith(".blob.vercel-storage.com")) return fail(400, "Not a gallery photo.")

  try {
    await del(String(url), blobAuth())
    return NextResponse.json({ ok: true }, { headers: corsHeaders })
  } catch (error) {
    console.error("Gallery delete failed:", error)
    return fail(500, "Couldn't delete the photo file.")
  }
}
