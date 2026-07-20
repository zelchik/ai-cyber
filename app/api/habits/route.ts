import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const cookieStore = await cookies()
  const userId = cookieStore.get("ai_planner_token")?.value

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const habits = await prisma.habit.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(habits)
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const userId = cookieStore.get("ai_planner_token")?.value

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    )
  }

  const body = await req.json()

  const habit = await prisma.habit.create({
    data: {
      title: body.title,
      completed: false,
      userId,
    },
  })

  return NextResponse.json(habit)
}