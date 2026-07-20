import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: { message: "Email and password required" } },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { ok: false, error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordIsValid) {
      return NextResponse.json(
        { ok: false, error: { message: "Invalid email or password" } },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();

    cookieStore.set("ai_planner_token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return NextResponse.json({
      ok: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          nickname: user.nickname,
        },
      },
    });
  } catch (err) {
    console.error("[AUTH LOGIN]", err);

    return NextResponse.json(
      { ok: false, error: { message: "Server error" } },
      { status: 500 }
    );
  }
}