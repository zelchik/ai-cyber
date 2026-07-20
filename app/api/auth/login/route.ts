import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// MVP: simple demo auth — replace with Google Sheets + bcrypt later
const DEMO_USER = {
  id: 'demo-001',
  email: 'demo@aiplanner.app',
  password: 'Demo123!',
  firstName: 'Demo',
  lastName: 'User',
  nickname: '@demo',
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json(
        { ok: false, error: { message: 'Email and password required' } },
        { status: 400 }
      )
    }

    // Demo check — replace with DB lookup + bcrypt.compare
    if (email !== DEMO_USER.email || password !== DEMO_USER.password) {
      return NextResponse.json(
        { ok: false, error: { message: 'Invalid email or password' } },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set('ai_planner_token', DEMO_USER.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    const { password: _, ...user } = DEMO_USER
    return NextResponse.json({ ok: true, data: { user } })
  } catch (err) {
    console.error('[AUTH LOGIN]', err)
    return NextResponse.json({ ok: false, error: { message: 'Server error' } }, { status: 500 })
  }
}
