'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const TITLES: Record<string, string> = {
  '/': 'ЧАТ',
  '/tasks': 'ЗАВДАННЯ',
  '/habits': 'ЗВИЧКИ',
  '/notes': 'НОТАТКИ',
  '/settings': 'НАЛАШТУВАННЯ',
}

export default function TopBar() {
  const pathname = usePathname()
  const title = TITLES[pathname] || 'AI PLANNER'

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'rgba(10,10,10,0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Image
          src="/logo.svg"
          alt="AI Planner"
          width={100}
          height={100}
          priority
        />
      </Link>

      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.1em',
        }}
      >
        <span style={{ color: 'var(--accent)' }}>//: </span>
        {title}
      </div>
    </div>
  )
}