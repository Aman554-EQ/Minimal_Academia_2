import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { personalInfo } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db.select().from(personalInfo).limit(1);
    return NextResponse.json(data[0] || null);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, ...data } = await request.json();
  
  if (id) {
    const result = await db.update(personalInfo).set({ ...data, updatedAt: new Date() }).where(eq(personalInfo.id, id)).returning();
    return NextResponse.json(result[0]);
  } else {
    const result = await db.insert(personalInfo).values(data).returning();
    return NextResponse.json(result[0]);
  }
}
