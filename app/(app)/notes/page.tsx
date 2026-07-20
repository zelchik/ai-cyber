'use client'

import { useEffect, useState } from 'react'

type Note = {
  id: string
  content: string
  createdAt: string
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  async function loadNotes() {
    try {
      const res = await fetch('/api/notes')

      if (!res.ok) {
        throw new Error('Не вдалося завантажити нотатки')
      }

      const data = await res.json()
      setNotes(data)
    } catch (error) {
      console.error('Помилка завантаження нотаток:', error)
    } finally {
      setLoading(false)
    }
  }

  async function deleteNote(id: string) {
  const res = await fetch(`/api/notes/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    console.error('Не вдалося видалити нотатку')
    return
  }

  setNotes((prev) => prev.filter((note) => note.id !== id))
}

  useEffect(() => {
    loadNotes()
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
        Завантаження нотаток...
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
      {notes.length === 0 ? (
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
          <div style={{ fontSize: '48px' }}>📄</div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-secondary)',
              letterSpacing: '0.08em',
            }}
          >
            //: НОТАТОК ПОКИ НЕМАЄ
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
              «Нотатка: ідея для нового AI дашборду»
            </span>
          </p>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            style={{
              padding: '16px',
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
  onClick={() => deleteNote(note.id)}
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
    e.currentTarget.style.background = 'rgba(220, 38, 38, 0.12)'
    e.currentTarget.style.color = '#ef4444'
  }}
>
  🗑 ВИДАЛИТИ
</button>
</div>
            <div
              style={{
                color: 'var(--text-primary)',
                fontSize: '15px',
                lineHeight: 1.5,
                whiteSpace: 'pre-wrap',
              }}
            >
              {note.content}
            </div>

            <div
              style={{
                marginTop: '10px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
              }}
            >
              {new Date(note.createdAt).toLocaleString('uk-UA')}
            </div>
          </div>
        ))
      )}
    </div>
  )
}