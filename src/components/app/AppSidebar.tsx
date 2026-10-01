import { clearLocalSession } from '@/lib/backend-reset';
import { Link, useNavigate } from '@tanstack/react-router'
import { 
  Home, 
  Map, 
  CloudSun, 
  Bell, 
  User, 
  LogOut,
  Waves,
  Calendar,
  FileText,
  ShieldAlert
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

import logoAsset from "@/assets/logo.asset.json"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AppSidebar({ className }: SidebarProps) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await clearLocalSession()
    navigate({ to: '/entrar' })
  }

  const menuItems = [
    { label: 'Início', icon: Home, to: '/app' },
    { label: 'Mapa', icon: Map, to: '/app/mapa' },
    { label: 'Hoje no Mar', icon: CloudSun, to: '/app/hoje' },
    { label: 'Tábua de Maré', icon: Waves, to: '/app/mare' },
    { label: 'Avisos', icon: Bell, to: '/app/avisos' },
    { label: 'Calendário', icon: Calendar, to: '/app/calendario' },
    { label: 'Documentos', icon: FileText, to: '/app/perfil/dados' },
    { label: 'Meu Perfil', icon: User, to: '/app/perfil' },
  ]

  return (
    <div className={cn("flex flex-col h-screen border-r bg-card", className)}>
      <div className="p-6">
        <Link to="/app" className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Logo" className="w-10 h-auto" />
          <span className="text-xl font-black text-primary tracking-tighter uppercase">Eu Pescador</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {menuItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeProps={{ className: "bg-primary text-primary-foreground shadow-md" }}
            inactiveProps={{ className: "text-muted-foreground hover:bg-accent hover:text-accent-foreground" }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all"
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button 
          variant="destructive" 
          className="w-full justify-start gap-3 rounded-2xl h-12 font-bold"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Sair do App
        </Button>
      </div>
    </div>
  )
}
