import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// MVP: saves to memory — replace with Google Sheets + bcrypt
const users: Array<{
  id: string; email: string; password: string;
  firstName: string; lastName: string; nickname: string;
}> = []

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { firstName, lastName, nickname, email, password, confirmPassword } = body

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { ok: false, error: { message: 'All fields required' } },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { ok: false, error: { message: 'Passwords do not match' } },
        { status: 400 }
      )
    }

    const pwRules = password.length >= 8 && /[A-Z]/.test(password) && /[!@#$%^&*]/.test(password)
    if (!pwRules) {
      return NextResponse.json(
        { ok: false, error: { message: 'Password does not meet requirements' } },
        { status: 400 }
      )
    }

    const existing = users.find((u) => u.email === email)
    if (existing) {
      return NextResponse.json(
        { ok: false, error: { message: 'Email already registered' } },
        { status: 409 }
      )
    }

    const id = 'user-' + Date.now()
    users.push({ id, email, password, firstName, lastName, nickname })

    const cookieStore = await cookies()
    cookieStore.set('ai_planner_token', id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return NextResponse.json({
      ok: true,
      data: { user: { id, email, firstName, lastName, nickname } },
    })
  } catch (err) {
    console.error('[AUTH REGISTER]', err)
    return NextResponse.json({ ok: false, error: { message: 'Server error' } }, { status: 500 })
  }
}
