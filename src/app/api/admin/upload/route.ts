import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getMediaBucket, mediaPublicUrl, makeMediaKey } from "@/lib/r2";

export const runtime = "nodejs";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB
const ALLOWED = /^(image|video)\//;

// Authenticated media upload → Cloudflare R2. Returns the public URL of the
// stored object, which the admin form then saves into the database.
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Not authorized." }, { status: 401 });
  }

  const bucket = await getMediaBucket();
  if (!bucket) {
    return NextResponse.json(
      {
        error:
          "R2 storage is not available in this environment. Uploads work on Cloudflare (or `npm run preview` with wrangler).",
      },
      { status: 501 },
    );
  }

  let file: File | null = null;
  try {
    const form = await request.formData();
    const f = form.get("file");
    if (f instanceof File) file = f;
  } catch {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  if (!file) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }
  if (!ALLOWED.test(file.type)) {
    return NextResponse.json(
      { error: "Only image and video files are allowed." },
      { status: 415 },
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 100 MB." }, { status: 413 });
  }

  const key = makeMediaKey(file.name || "file");
  try {
    await bucket.put(key, await file.arrayBuffer(), {
      httpMetadata: { contentType: file.type },
    });
  } catch {
    return NextResponse.json({ error: "Upload failed. Try again." }, { status: 500 });
  }

  return NextResponse.json({ url: mediaPublicUrl(key), key });
}
