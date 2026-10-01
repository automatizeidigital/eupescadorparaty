import { Link } from '@tanstack/react-router'
import { Bell, User, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import logoAsset from "@/assets/logo.asset.json"

export function TopBar() {
  return (
    <header className="h-16 border-b bg-card px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div className="flex items-center gap-3 md:hidden">
        <img src={logoAsset.url} alt="Logo" className="w-8 h-auto" />
        <span className="font-black text-primary tracking-tighter uppercase">Eu Pescador</span>
      </div>
      
      <div className="hidden md:flex flex-1">
        {/* Placeholder para busca ou pão de mel */}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full relative" asChild>
          <Link to="/app/avisos">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
          </Link>
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full" asChild>
          <Link to="/app/perfil">
            <User size={20} />
          </Link>
        </Button>
      </div>
    </header>
  )
}
