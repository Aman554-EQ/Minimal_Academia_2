import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { upcomingEvents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(upcomingEvents).orderBy(asc(upcomingEvents.orderIndex));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = await db.insert(upcomingEvents).values(body).returning();
  return NextResponse.json(result[0]);
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await request.json();
  const result = await db.update(upcomingEvents).set(data).where(eq(upcomingEvents.id, id)).returning();
  return NextResponse.json(result[0]);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get("id") || "0");
  await db.delete(upcomingEvents).where(eq(upcomingEvents.id, id));
  return NextResponse.json({ success: true });
}
