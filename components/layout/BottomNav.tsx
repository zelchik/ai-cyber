'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  { href: '/',         label: 'ЧАТ',          icon: '💬' },
  { href: '/tasks',    label: 'ЗАВДАННЯ',    icon: '✓' },
  { href: '/habits',   label: 'ЗВИЧКИ',      icon: '⚡' },
  { href: '/notes',    label: 'НОТАТКИ',     icon: '📄' },
  { href: '/settings', label: 'БІЛЬШЕ',      icon: '⚙' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav style={{
      display: 'flex',
      borderTop: '1px solid var(--border-subtle)',
      background: 'rgba(10,10,10,0.95)',
      backdropFilter: 'blur(20px)',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 10,
    }}>
      {TABS.map(({ href, label, icon }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '10px 4px',
              textDecoration: 'none',
              gap: '4px',
              position: 'relative',
              transition: 'all 0.15s ease',
            }}
          >
            {isActive && (
              <div style={{
                position: 'absolute',
                top: 0, left: '50%',
                transform: 'translateX(-50%)',
                width: '24px', height: '2px',
                background: 'var(--accent)',
                borderRadius: '0 0 2px 2px',
                boxShadow: '0 0 8px var(--accent-glow)',
              }} />
            )}
            <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '0.08em',
              color: isActive ? 'var(--accent)' : 'var(--text-muted)',
              textShadow: isActive ? '0 0 10px var(--accent-glow)' : 'none',
              transition: 'all 0.15s ease',
            }}>
              {isActive ? `[ ${label} ]` : label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
