import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminGuard } from '@/components/admin/AdminGuard'
import { checkIsAdmin } from '@/lib/auth-roles.functions'
import { supabase } from '@/integrations/supabase/client'

export const Route = createFileRoute('/admin')({
  beforeLoad: async ({ context }) => {
    if (typeof window === 'undefined') return;
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      throw redirect({ to: '/entrar' })
    }

    try {
      const isAdmin = await context.queryClient.ensureQueryData({
        queryKey: ['is-admin'],
        queryFn: () => checkIsAdmin(),
      })

      if (!isAdmin) {
        throw redirect({ to: '/app' })
      }
    } catch (e) {
      if (e instanceof Error && e.message.includes('redirect')) throw e
      throw redirect({ to: '/app' })
    }
  },
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="flex-1 lg:p-8 p-4 pt-20 lg:pt-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </AdminGuard>
  )
}


