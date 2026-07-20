import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()

    const habit = await prisma.habit.update({
      where: {
        id,
      },
      data: {
        completed: body.completed,
      },
    })

    return NextResponse.json(habit)
  } catch (error) {
    console.error("HABIT PATCH ERROR:", error)

    return NextResponse.json(
      {
        error: "Не вдалося оновити звичку",
      },
      {
        status: 500,
      }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.habit.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("HABIT DELETE ERROR:", error)

    return NextResponse.json(
      {
        error: "Не вдалося видалити звичку",
      },
      {
        status: 500,
      }
    )
  }
}