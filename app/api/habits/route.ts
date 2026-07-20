import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const habits = await prisma.habit.findMany({
    where: {
      userId: "demo-user",
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return NextResponse.json(habits)
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const habit = await prisma.habit.create({
    data: {
      title: body.title,
      completed: false,
      userId: "demo-user",
    },
  })

  return NextResponse.json(habit)
}