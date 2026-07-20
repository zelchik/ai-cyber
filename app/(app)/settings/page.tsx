'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type User = {
  email: string
  firstName: string
  lastName: string
  nickname: string | null
}

export default function SettingsPage() {
  const router = useRouter()

  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) {
          setUser(data.data.user)
        }
      })
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-secondary)',
            letterSpacing: '0.1em',
            marginBottom: '16px',
          }}
        >
          //: ОБЛІКОВИЙ ЗАПИС
        </div>

        <div className="card-cyber">
          <div
            style={{
              color: 'var(--text-secondary)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              marginBottom: '8px',
            }}
          >
            {user?.nickname ?? '@user'}
          </div>

          <div style={{ color: 'var(--text-primary)', fontSize: '15px' }}>
            {user?.email}
          </div>

          <div
            style={{
              color: 'var(--text-secondary)',
              marginTop: '8px',
            }}
          >
            {user?.firstName} {user?.lastName}
          </div>
        </div>
      </div>

      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '14px',
          background: 'transparent',
          border: '1px solid var(--state-error)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--state-error)',
          fontFamily: 'var(--font-mono)',
          cursor: 'pointer',
        }}
      >
        [ ВИЙТИ ]
      </button>
    </div>
  )
}