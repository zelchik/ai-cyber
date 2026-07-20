import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("ai_planner_token")?.value;

    if (!userId) {
      return NextResponse.json(
        { ok: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        nickname: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: { message: "User not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      data: { user },
    });
  } catch (err) {
    console.error("[AUTH ME]", err);

    return NextResponse.json(
      { ok: false, error: { message: "Server error" } },
      { status: 500 }
    );
  }
}