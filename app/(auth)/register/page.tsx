'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

function PasswordRule({ met, text }: { met: boolean; text: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
      <span style={{ color: met ? 'var(--accent)' : 'var(--text-muted)', fontSize: '13px' }}>
        {met ? '✓' : '○'}
      </span>
      <span style={{ color: met ? 'var(--text-secondary)' : 'var(--text-muted)', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
        {text}
      </span>
    </div>
  )
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const rules = {
    length: form.password.length >= 8,
    upper: /[A-Z]/.test(form.password),
    special: /[!@#$%^&*]/.test(form.password),
  }

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!rules.length || !rules.upper || !rules.special) {
      setError('Password does not meet requirements')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error?.message || 'Registration failed')
        setLoading(false)
        return
      }

      router.push('/')
    } catch {
      setError('Network error. Try again.')
      setLoading(false)
    }
  }

  const field = (label: string, key: string, type = 'text', placeholder = '') => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'block',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        textTransform: 'uppercase',
        marginBottom: '6px',
      }}>
        //: {label}
      </label>
      <input
        className="input-cyber"
        type={type}
        placeholder={placeholder}
        value={form[key as keyof typeof form]}
        onChange={(e) => update(key, e.target.value)}
      />
    </div>
  )

  return (
    <div className="fade-in" style={{ width: '100%', maxWidth: '420px' }}>
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '24px',
          fontWeight: 700,
          color: 'var(--accent)',
          textShadow: '0 0 20px var(--accent-glow)',
          letterSpacing: '0.1em',
          marginBottom: '8px',
        }}>
          [ AI PLANNER ]
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
          //: CREATE ACCOUNT
        </p>
      </div>

      <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                //: FIRST NAME
              </label>
              <input className="input-cyber" type="text" placeholder="John" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                //: LAST NAME
              </label>
              <input className="input-cyber" type="text" placeholder="Doe" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
            </div>
          </div>

          {field('NICKNAME', 'nickname', 'text', '@johndoe')}
          {field('EMAIL', 'email', 'email', 'you@example.com')}
          {field('PASSWORD', 'password', 'password', '••••••••')}

          {form.password.length > 0 && (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <PasswordRule met={rules.length}  text="8+ characters" />
              <PasswordRule met={rules.upper}   text="1 uppercase letter (A-Z)" />
              <PasswordRule met={rules.special} text="1 special character (!@#$%^&*)" />
            </div>
          )}

          {field('CONFIRM PASSWORD', 'confirmPassword', 'password', '••••••••')}

          {error && (
            <p style={{ color: 'var(--state-error)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
          )}

          <button type="submit" className="btn-accent" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'CREATING...' : '[ CREATE ACCOUNT ]'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Have account? </span>
          <Link href="/login" style={{ color: 'var(--accent)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            [ LOG IN ]
          </Link>
        </div>
      </div>
    </div>
  )
}
