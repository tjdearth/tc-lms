import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { randomUUID } from "crypto";

const BUCKET = "wiki-images";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/gif", "image/webp", "image/svg+xml"];

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }
  return null;
}

function extFromContentType(ct: string): string {
  const map: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/gif": "gif",
    "image/webp": "webp",
    "image/svg+xml": "svg",
  };
  return map[ct] || "png";
}

async function uploadToStorage(buffer: Buffer, contentType: string): Promise<string> {
  const ext = extFromContentType(contentType);
  const fileName = `${randomUUID()}.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET)
    .upload(fileName, buffer, {
      contentType,
      upsert: false,
    });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = supabaseAdmin.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

// POST — upload a file OR proxy-fetch an image URL
export async function POST(req: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const contentType = req.headers.get("content-type") || "";

    // === JSON body: proxy an external image URL ===
    if (contentType.includes("application/json")) {
      const { url } = await req.json();
      if (!url || typeof url !== "string") {
        return NextResponse.json({ error: "url is required" }, { status: 400 });
      }

      // Fetch the image server-side (bypasses CORS and carries no auth issues)
      const imgRes = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0" },
        redirect: "follow",
      });

      if (!imgRes.ok) {
        return NextResponse.json(
          { error: `Failed to fetch image: ${imgRes.status}` },
          { status: 400 }
        );
      }

      const imgType = imgRes.headers.get("content-type")?.split(";")[0] || "image/png";
      if (!ALLOWED_TYPES.includes(imgType)) {
        return NextResponse.json(
          { error: `Remote image type not allowed: ${imgType}` },
          { status: 400 }
        );
      }

      const arrayBuf = await imgRes.arrayBuffer();
      if (arrayBuf.byteLength > MAX_SIZE) {
        return NextResponse.json(
          { error: `Remote image too large (${Math.round(arrayBuf.byteLength / 1024)}KB). Max ${MAX_SIZE / 1024 / 1024}MB` },
          { status: 400 }
        );
      }

      const publicUrl = await uploadToStorage(Buffer.from(arrayBuf), imgType);
      return NextResponse.json({ url: publicUrl });
    }

    // === FormData body: direct file upload ===
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `Invalid file type: ${file.type}. Allowed: ${ALLOWED_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const publicUrl = await uploadToStorage(buffer, file.type);
    return NextResponse.json({ url: publicUrl });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
