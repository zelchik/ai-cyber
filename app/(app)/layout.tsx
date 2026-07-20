import BottomNav from '@/components/layout/BottomNav'
import TopBar from '@/components/layout/TopBar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      overflow: 'hidden',
    }}>
      <TopBar />
      <main style={{
        flex: 1,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
