import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      firstName,
      lastName,
      nickname,
      email,
      password,
      confirmPassword,
    } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: { message: "All fields required" } },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { ok: false, error: { message: "Passwords do not match" } },
        { status: 400 }
      );
    }

    const pwRules =
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[!@#$%^&*]/.test(password);

    if (!pwRules) {
      return NextResponse.json(
        {
          ok: false,
          error: { message: "Password does not meet requirements" },
        },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { ok: false, error: { message: "Email already registered" } },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        nickname: nickname || null,
      },
    });

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
    console.error("[AUTH REGISTER]", err);

    return NextResponse.json(
      { ok: false, error: { message: "Server error" } },
      { status: 500 }
    );
  }
}