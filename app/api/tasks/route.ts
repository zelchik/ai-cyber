import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"


export async function GET() {

  const tasks = await prisma.task.findMany({
    where:{
      userId:"demo-user"
    },
    orderBy:{
      createdAt:"desc"
    }
  })


  return NextResponse.json(tasks)

}