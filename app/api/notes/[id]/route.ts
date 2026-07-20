import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params

    await prisma.note.delete({
      where: {
        id,
      },
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error("NOTE DELETE ERROR:", error)

    return NextResponse.json(
      {
        error: "Не вдалося видалити нотатку",
      },
      {
        status: 500,
      }
    )
  }
}