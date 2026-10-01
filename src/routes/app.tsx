import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app/AppSidebar'
import { TopBar } from '@/components/app/TopBar'
import { BottomNav } from '@/components/app/BottomNav'
import { getProfile } from '@/lib/profiles.functions'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/app')({
  beforeLoad: async ({ location }) => {
    if (typeof window === 'undefined') return;
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session) {
      throw redirect({
        to: '/entrar',
        search: {
          redirect: location.href,
        },
      })
    }

    {
      const profile = await getProfile()
      
      // Se o perfil existe mas não completou o cadastro, redireciona para a página de cadastro
      // Exceto se já estiver na página de cadastro ou callback
      if (profile && !profile.registration_completed && !location.pathname.includes('/cadastro')) {
        throw redirect({
          to: '/cadastro',
        })
      }
    }
  },
  component: AppLayout,
})

function AppLayout() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0 md:pl-64">
      <AppSidebar className="hidden md:flex" />
      <div className="flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
      <BottomNav className="md:hidden" />
    </div>
  )
}
