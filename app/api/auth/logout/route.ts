import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete('ai_planner_token')
  return NextResponse.json({ ok: true })
}
