import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("ai_planner_token")?.value

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const notes = await prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("NOTES GET ERROR:", error)

    return NextResponse.json(
      {
        error: "Не вдалося завантажити нотатки",
      },
      {
        status: 500,
      }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get("ai_planner_token")?.value

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await req.json()

    const note = await prisma.note.create({
      data: {
        content: body.content,
        userId,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("NOTES POST ERROR:", error)

    return NextResponse.json(
      {
        error: "Не вдалося створити нотатку",
      },
      {
        status: 500,
      }
    )
  }
}