'use client'

import { useEffect, useState } from 'react'

type Habit = {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export default function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)

  async function loadHabits() {
    try {
      const res = await fetch('/api/habits')

      if (!res.ok) {
        throw new Error('Не вдалося завантажити звички')
      }

      const data = await res.json()
      setHabits(data)
    } catch (error) {
      console.error('Помилка завантаження звичок:', error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleHabit(id: string, completed: boolean) {
    const res = await fetch(`/api/habits/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        completed,
      }),
    })

    if (!res.ok) {
      console.error('Не вдалося оновити звичку')
      return
    }

    loadHabits()
  }

  async function deleteHabit(id: string) {
    const res = await fetch(`/api/habits/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      console.error('Не вдалося видалити звичку')
      return
    }

    setHabits((prev) => prev.filter((habit) => habit.id !== id))
  }

  useEffect(() => {
    loadHabits()
  }, [])

  if (loading) {
    return (
      <div
        style={{
          padding: '20px',
          color: 'var(--text-muted)',
          fontFamily: 'var(--font-mono)',
        }}
      >
        Завантаження звичок...
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        padding: '20px',
      }}
    >
      {habits.length === 0 ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            gap: '16px',
          }}
        >
          <div style={{ fontSize: '48px' }}>⚡</div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
            }}
          >
            //: ЗВИЧОК ПОКИ НЕМАЄ
          </div>

          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              textAlign: 'center',
              maxWidth: '280px',
            }}
          >
            Перейдіть у Чат і скажіть:
            <br />
            <span style={{ color: 'var(--accent)' }}>
              «Додай звичку пити 8 склянок води»
            </span>
          </p>
        </div>
      ) : (
        habits.map((habit) => (
          <div
            key={habit.id}
            style={{
              padding: '14px',
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-default)',
              borderRadius: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: '8px',
              }}
            >
              <button
                onClick={() => deleteHabit(habit.id)}
                style={{
                  background: 'rgba(220, 38, 38, 0.12)',
                  border: '1px solid #dc2626',
                  borderRadius: '8px',
                  color: '#ef4444',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '5px 8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#dc2626'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background =
                    'rgba(220, 38, 38, 0.12)'
                  e.currentTarget.style.color = '#ef4444'
                }}
              >
                🗑 ВИДАЛИТИ
              </button>
            </div>

            <button
              onClick={() =>
                toggleHabit(habit.id, !habit.completed)
              }
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div
                style={{
                  width: '22px',
                  height: '22px',
                  minWidth: '22px',
                  borderRadius: '50%',
                  border: habit.completed
                    ? '1px solid var(--accent)'
                    : '1px solid var(--border-default)',
                  background: habit.completed
                    ? 'var(--accent)'
                    : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--bg-primary)',
                  fontSize: '13px',
                }}
              >
                {habit.completed ? '✓' : ''}
              </div>

              <span
                style={{
                  color: habit.completed
                    ? 'var(--text-muted)'
                    : 'var(--text-primary)',
                  textDecoration: habit.completed
                    ? 'line-through'
                    : 'none',
                  fontSize: '15px',
                }}
              >
                {habit.title}
              </span>
            </button>
          </div>
        ))
      )}
    </div>
  )
}