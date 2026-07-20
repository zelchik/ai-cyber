import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  const body = await req.json()


  const task = await prisma.task.update({

    where: {
      id
    },

    data: {
      completed: body.completed
    }

  })


  return NextResponse.json(task)

}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.task.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("TASK DELETE ERROR:", error)

    return NextResponse.json(
      {
        error: "Не вдалося видалити задачу",
      },
      {
        status: 500,
      }
    )
  }
}