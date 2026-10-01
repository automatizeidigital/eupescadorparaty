import { Link } from '@tanstack/react-router'
import { Home, Map, CloudSun, Bell, User } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BottomNavProps extends React.HTMLAttributes<HTMLDivElement> {}

export function BottomNav({ className }: BottomNavProps) {
  const navItems = [
    { label: 'Início', icon: Home, to: '/app' },
    { label: 'Mapa', icon: Map, to: '/app/mapa' },
    { label: 'Hoje', icon: CloudSun, to: '/app/hoje' },
    { label: 'Avisos', icon: Bell, to: '/app/avisos' },
    { label: 'Perfil', icon: User, to: '/app/perfil' },
  ]

  return (
    <nav className={cn(
      "fixed bottom-0 left-0 right-0 h-20 bg-card border-t flex items-center justify-around px-2 z-50 pb-safe",
      className
    )}>
      {navItems.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          activeProps={{ className: "text-primary" }}
          inactiveProps={{ className: "text-muted-foreground" }}
          className="flex flex-col items-center gap-1 px-3 py-2 transition-colors"
        >
          <item.icon size={24} />
          <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}
