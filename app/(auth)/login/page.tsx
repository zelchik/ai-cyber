'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Step = 'email' | 'password'

export default function LoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [shake, setShake] = useState(false)

  function triggerShake(msg: string) {
    setError(msg)
    setShake(true)
    setTimeout(() => setShake(false), 400)
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes('@')) {
      triggerShake('Enter a valid email address')
      return
    }
    setStep('password')
    setError('')
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!password) {
      triggerShake('Enter your password')
      return
    }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        triggerShake(data.error?.message || 'Invalid credentials')
        setLoading(false)
        return
      }

      router.push('/')
    } catch {
      triggerShake('Network error. Try again.')
      setLoading(false)
    }
  }

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '400px' }}>
     {/* Logo */}
<div style={{ textAlign: 'center', marginBottom: '48px' }}>
  <div style={{ marginBottom: '8px' }}>
<img
  src="/logo.svg"
  alt="AI Planner"
  style={{
    display: 'block',
    width: '220px',
    height: 'auto',
    margin: '0 auto',
  }}
/>
  </div>

  <p
    style={{
      color: 'var(--text-muted)',
      fontSize: '13px',
      fontFamily: 'var(--font-mono)',
      letterSpacing: '0.06em',
    }}
  >
    //: ТВОЄ ПЕРСОНАЛЬНЕ AI-ПЛАНУВАННЯ
  </p>
</div>

      {/* Card */}
      <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '32px' }}>
        {step === 'email' ? (
          <form onSubmit={handleEmail}>
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                //: Електронна пошта
              </label>
              <input
                className={`input-cyber ${shake ? 'shake' : ''}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
            </div>

            {error && (
              <p style={{ color: 'var(--state-error)', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-accent" style={{ width: '100%' }}>
              Далі →
            </button>
          </form>
        ) : (
          <form onSubmit={handlePassword}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              color: 'var(--text-secondary)',
              marginBottom: '20px',
              padding: '10px 14px',
              background: 'var(--bg-elevated)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
            }}>
              {email}
              <button
                type="button"
                onClick={() => setStep('email')}
                style={{
                  float: 'right',
                  background: 'none',
                  border: 'none',
                  color: 'var(--accent)',
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                Змінити
              </button>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                marginBottom: '8px',
              }}>
                //: Пароль
              </label>
              <input
                className={`input-cyber ${shake ? 'shake' : ''}`}
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
            </div>

            {error && (
              <p style={{ color: 'var(--state-error)', fontSize: '13px', marginBottom: '16px' }}>
                {error}
              </p>
            )}

            <button type="submit" className="btn-accent" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Завантаження...' : '[ Увійти ]'}
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Ще немає акаунта?{' '}
          </span>
          <Link href="/register" style={{ color: 'var(--accent)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            [ ЗАРЕЄСТРУВАТИСЯ ]
          </Link>
        </div>
      </div>
    </div>
  )
}
