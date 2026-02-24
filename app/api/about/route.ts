import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { aboutParagraphs } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const paragraphs = await db
      .select()
      .from(aboutParagraphs)
      .orderBy(asc(aboutParagraphs.orderIndex));
    return NextResponse.json(paragraphs);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content, orderIndex } = await request.json();
  const result = await db.insert(aboutParagraphs).values({ content, orderIndex: orderIndex ?? 0 }).returning();
  return NextResponse.json(result[0]);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, content, orderIndex } = await request.json();
  const result = await db.update(aboutParagraphs).set({ content, orderIndex }).where(eq(aboutParagraphs.id, id)).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "0");
  await db.delete(aboutParagraphs).where(eq(aboutParagraphs.id, id));
  return NextResponse.json({ success: true });
}
