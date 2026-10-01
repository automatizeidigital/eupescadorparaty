import { getSignedOutSession } from '@/lib/backend-reset';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AppSidebar } from '@/components/app/AppSidebar'
import { TopBar } from '@/components/app/TopBar'
import { BottomNav } from '@/components/app/BottomNav'
import { getProfile } from '@/lib/profiles.functions'


export const Route = createFileRoute('/app')({
  beforeLoad: () => { throw redirect({ to: '/entrar' }); },
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
