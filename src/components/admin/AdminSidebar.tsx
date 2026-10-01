import React from 'react';
import { Link, useLocation } from '@tanstack/react-router';
import { 
  LayoutDashboard, 
  Users, 
  Ship, 
  Map as MapIcon, 
  Waves, 
  ShieldAlert, 
  FileText, 
  Megaphone, 
  Bell, 
  MessageSquare, 
  Briefcase, 
  Fish, 
  Calendar, 
  BarChart3, 
  UserCog, 
  History, 
  Settings,
  Menu,
  Globe,
  Key,
  ShieldCheck,
  Activity,
  LogOut
} from 'lucide-react';
import logoAsset from "@/assets/logo.asset.json";
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { supabase } from '@/integrations/supabase/client';
import { logAdminAction } from '@/lib/audit.functions';

const menuGroups = [
  {
    title: 'Visão Geral',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, to: '/admin' },
    ]
  },
  {
    title: 'Cadastros',
    items: [
      { label: 'Pescadores', icon: Users, to: '/admin/pescadores' },
      { label: 'Embarcações', icon: Ship, to: '/admin/embarcacoes' },
      { label: 'Carteirinhas', icon: ShieldCheck, to: '/admin/carteirinhas' },
      { label: 'Documentos', icon: FileText, to: '/admin/documentos' },
    ]
  },
  {
    title: 'Operação',
    items: [
      { label: 'Mapa Operacional', icon: MapIcon, to: '/admin/mapa' },
      { label: 'Saídas', icon: Waves, to: '/admin/saidas' },
      { label: 'Segurança & SOS', icon: ShieldAlert, to: '/admin/seguranca' },
    ]
  },
  {
    title: 'Comunicação',
    items: [
      { label: 'Avisos', icon: Megaphone, to: '/admin/avisos' },
      { label: 'Notificações', icon: Bell, to: '/admin/notificacoes' },
      { label: 'Solicitações', icon: MessageSquare, to: '/admin/solicitacoes' },
    ]
  },
  {
    title: 'Serviços',
    items: [
      { label: 'Serviços', icon: Briefcase, to: '/admin/servicos' },
      { label: 'Defeso', icon: Fish, to: '/admin/defeso' },
      { label: 'Calendário', icon: Calendar, to: '/admin/calendario' },
    ]
  },
  {
    title: 'Sistema',
    items: [
      
      { label: 'APIs', icon: Key, to: '/admin/apis' },
      { label: 'Usuários', icon: UserCog, to: '/admin/usuarios' },
      { label: 'Relatórios', icon: BarChart3, to: '/admin/relatorios' },
      { label: 'Auditoria', icon: History, to: '/admin/auditoria' },
      { label: 'Saúde do Sistema', icon: Activity, to: '/admin/saude' },
      { label: 'Configurações', icon: Settings, to: '/admin/configuracoes' },
    ]
  }
];

export function AdminSidebar() {
  const location = useLocation();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/entrar';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-400 border-r border-slate-800">
      <div className="p-6 border-b border-slate-800 bg-slate-950/20">
        <Link to="/admin" className="flex items-center gap-3 text-white font-black text-xl tracking-tighter">
          <img src={logoAsset.url} alt="Logo" className="h-10 w-auto" />
          <div className="flex flex-col leading-none">
            <span>EU PESCADOR!</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Administração</span>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar pt-6">
        {menuGroups.map((group, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = location.pathname === item.to || (item.to !== '/admin' && location.pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => {
                      if (!active) {
                        logAdminAction({
                          data: {
                            action: 'NAVIGATE',
                            module: 'ADMIN_SIDEBAR',
                            entity_type: 'MENU_ITEM',
                            metadata: { to: item.to, label: item.label }
                          }
                        }).catch(console.error);
                      }
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group ${
                      active 
                        ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' 
                        : 'hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                  >
                    <item.icon size={18} className={active ? 'text-white' : 'text-slate-600 group-hover:text-slate-400'} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 bg-slate-950/30 space-y-2">
        <Link to="/app" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition-colors text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white">
          <History size={16} />
          Voltar para App
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-300"
        >
          <LogOut size={16} />
          Sair do Painel
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>

      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-2xl shadow-xl bg-slate-900 border-slate-800 text-white">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-none">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
