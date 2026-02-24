import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { education } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(education).orderBy(asc(education.orderIndex));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = await db.insert(education).values(body).returning();
  return NextResponse.json(result[0]);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await request.json();
  const result = await db.update(education).set(data).where(eq(education.id, id)).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "0");
  await db.delete(education).where(eq(education.id, id));
  return NextResponse.json({ success: true });
}
