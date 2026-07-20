'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image";

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
      setError('Пароль не відповідає вимогам')
      return
    }
    if (form.password !== form.confirmPassword) {
      setError('Паролі не збігаються')
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
        setError(data.error?.message || 'Не вдалося створити акаунт')
        setLoading(false)
        return
      }

      router.push('/')
    } catch {
      setError('Помилка мережі. Спробуйте ще раз.')
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
    }}
  >
    //: СТВОРЕННЯ ОБЛІКОВОГО ЗАПИСУ
  </p>
</div>

      <div className="glass" style={{ borderRadius: 'var(--radius-xl)', padding: '28px' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                //: ІМ'Я
              </label>
              <input className="input-cyber" type="text" placeholder="Ім'я" value={form.firstName} onChange={(e) => update('firstName', e.target.value)} required />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '0.08em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '6px' }}>
                //: ПРІЗВИЩЕ
              </label>
              <input className="input-cyber" type="text" placeholder="Прізвище" value={form.lastName} onChange={(e) => update('lastName', e.target.value)} required />
            </div>
          </div>

          {field('НІКНЕЙМ', 'nickname', 'text', '@nickname')}
          {field('Е-ПОШТА', 'email', 'email', 'Введіть email')}
          {field('ПАРОЛЬ', 'password', 'password', '••••••••')}

          {form.password.length > 0 && (
            <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
              <PasswordRule met={rules.length} text="Щонайменше 8 символів" />
              <PasswordRule met={rules.upper} text="1 велика літера (A-Z)" />
              <PasswordRule met={rules.special} text="1 спеціальний символ (!@#$%^&*)" />
            </div>
          )}

          {field('ПІДТВЕРДІТЬ ПАРОЛЬ', 'confirmPassword', 'password', '••••••••')}

          {error && (
            <p style={{ color: 'var(--state-error)', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
          )}

          <button type="submit" className="btn-accent" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'СТВОРЕННЯ...' : '[ ЗАРЕЄСТРУВАТИСЯ ]'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Вже маєте акаунт? </span>
          <Link href="/login" style={{ color: 'var(--accent)', fontSize: '13px', fontFamily: 'var(--font-mono)' }}>
            [ УВІЙТИ ]
          </Link>
        </div>
      </div>
    </div>
  )
}
