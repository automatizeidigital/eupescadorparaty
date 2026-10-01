import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from '@tanstack/react-router'
import { getProfile } from '@/lib/profiles.functions'
import { checkIsAdmin } from '@/lib/auth-roles.functions'

export const Route = createFileRoute('/auth/callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        // Tentar trocar o código por sessão caso venha via PKCE (o SDK geralmente faz automático, mas garantimos aqui)
        const code = new URL(window.location.href).searchParams.get('code')
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            console.error("Erro ao trocar código por sessão:", exchangeError)
            navigate({ to: '/entrar' })
            return
          }
          // Sessão estabelecida com sucesso, continuar fluxo
        } else {
          navigate({ to: '/entrar' })
          return
        }
      }


      // Buscar perfil para decidir o redirecionamento
      try {
        if (await checkIsAdmin()) {
          navigate({ to: '/admin' })
          return
        }
        const profile = await getProfile()
        
        if (profile?.registration_completed) {
          navigate({ to: '/app' })
        } else {
          navigate({ to: '/cadastro' })
        }
      } catch (err) {
        console.error("Erro no callback de auth:", err)
        navigate({ to: '/cadastro' })
      }
    }

    handleAuth()
  }, [navigate])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xl font-bold animate-pulse text-primary">Autenticando...</p>
        <p className="text-muted-foreground">Você será redirecionado em instantes.</p>
      </div>
    </div>
  )
}
