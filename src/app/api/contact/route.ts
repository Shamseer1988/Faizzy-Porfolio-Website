import { NextResponse } from "next/server";
import { prisma, hasDatabase } from "@/lib/db";

export async function POST(request: Request) {
  let payload: { name?: unknown; email?: unknown; message?: unknown };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const message = String(payload.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email and message are all required." },
      { status: 400 },
    );
  }
  if (name.length > 100 || email.length > 200 || message.length > 4000) {
    return NextResponse.json({ error: "Message is too long." }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!hasDatabase()) {
    return NextResponse.json(
      { error: "The inbox is offline in this preview. Try the live site!" },
      { status: 503 },
    );
  }

  try {
    await prisma.message.create({ data: { name, email, body: message } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not save your message right now. Please try again later." },
      { status: 503 },
    );
  }
}
