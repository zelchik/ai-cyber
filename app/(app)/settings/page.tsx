'use client'

import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '11px', 
          color: 'var(--text-secondary)', 
          letterSpacing: '0.1em', 
          marginBottom: '16px' 
        }}>
          //: ОБЛІКОВИЙ ЗАПИС
        </div>

        <div className="card-cyber" style={{ marginBottom: '12px' }}>
          <div style={{ 
            color: 'var(--text-secondary)', 
            fontSize: '12px', 
            fontFamily: 'var(--font-mono)', 
            marginBottom: '4px' 
          }}>
            ДЕМО КОРИСТУВАЧ
          </div>

          <div style={{ 
            color: 'var(--text-primary)', 
            fontSize: '15px' 
          }}>
            demo@aiplanner.app
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <div style={{ 
          fontFamily: 'var(--font-mono)', 
          fontSize: '11px', 
          color: 'var(--text-secondary)', 
          letterSpacing: '0.1em', 
          marginBottom: '16px' 
        }}>
          //: СКОРО
        </div>

        {[
          'Синхронізація Google Calendar',
          'Сповіщення Telegram',
          'Темна / Світла тема',
          'Змінити пароль',
        ].map((item) => (
          <div 
            key={item} 
            className="card-cyber" 
            style={{ 
              marginBottom: '8px', 
              cursor: 'not-allowed', 
              opacity: 0.5 
            }}
          >
            <div style={{ 
              color: 'var(--text-secondary)', 
              fontSize: '14px', 
              fontFamily: 'var(--font-mono)' 
            }}>
              [ {item.toUpperCase()} ]
            </div>
          </div>
        ))}
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
          fontSize: '13px',
          letterSpacing: '0.08em',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
      >
        [ ВИЙТИ ]
      </button>
    </div>
  )
}