import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  ChevronLeft, 
  CreditCard,
  Download,
  Share2,
  Calendar,
  User,
  Anchor,
  QrCode
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/app/carteirinha')({
  head: () => ({
    meta: [
      { title: "Carteira Digital do Pescador | EU PESCADOR!" },
      { name: "description", content: "Sua identificação municipal digital de pescador de Paraty sempre à mão." },
      { property: "og:title", content: "Carteira Digital do Pescador - Paraty" },
      { property: "og:description", content: "Acesse seu Registro Municipal de Pescador digitalmente." },
    ],
  }),
  component: CarteirinhaPage,
})

function CarteirinhaPage() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (error) throw error
      return data
    }
  })

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>

  return (
    <div className="p-6 space-y-8 pb-24 max-w-[430px] mx-auto">
      <header className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/app/perfil">
            <ChevronLeft size={28} />
          </Link>
        </Button>
        <h2 className="text-2xl font-black tracking-tight">Minha Carteirinha</h2>
      </header>

      {/* Carteirinha Digital Visual */}
      <div className="relative group">
        <Card className="bg-gradient-to-br from-primary to-primary-foreground border-none rounded-[2rem] overflow-hidden shadow-2xl aspect-[1.58/1] relative text-white">
          {/* Background Decor */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-3xl" />
          
          <CardContent className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="flex justify-between items-start">
              <div className="space-y-0">
                <h3 className="text-lg font-black uppercase tracking-tighter leading-tight">EU PESCADOR!</h3>
                <p className="text-[8px] font-bold opacity-80 uppercase tracking-widest">Secretaria Municipal de Pesca de Paraty</p>
              </div>
              <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                <Anchor size={20} className="text-white" />
              </div>
            </div>

            <div className="flex gap-4 items-end">
              <div className="h-20 w-16 bg-white/20 rounded-lg overflow-hidden border border-white/30 backdrop-blur-md shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <User size={32} className="opacity-50" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <h4 className="text-base font-black uppercase truncate leading-tight">{profile?.full_name || 'PESCADOR'}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[7px] uppercase font-black opacity-70 tracking-tighter">REGISTRO MUNICIPAL</p>
                    <p className="text-xs font-bold font-mono">{profile?.municipal_registration || 'PES-000000'}</p>
                  </div>
                  <div>
                    <p className="text-[7px] uppercase font-black opacity-70 tracking-tighter">VALIDADE</p>
                    <p className="text-xs font-bold">Não emitida</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* QR Code Section */}
      <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md">
        <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
          <div className="bg-muted p-4 rounded-3xl border-4 border-white shadow-inner">
            <CreditCard size={80} className="text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-black uppercase tracking-tight">Validação em desenvolvimento</h3>
            <p className="text-muted-foreground text-sm leading-relaxed px-4">
              Esta é uma prévia da carteira. A emissão e a validação oficial ainda não estão disponíveis.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Ações */}
      <div className="grid grid-cols-2 gap-4">
        <Button disabled variant="outline" className="h-14 rounded-2xl font-black uppercase tracking-widest gap-2 border-2">
          <Download size={20} /> BAIXAR
        </Button>
        <Button disabled variant="outline" className="h-14 rounded-2xl font-black uppercase tracking-widest gap-2 border-2">
          <Share2 size={20} /> ENVIAR
        </Button>
      </div>

      <div className="p-4 bg-muted/50 rounded-2xl flex items-start gap-3">
        <AlertCircle size={20} className="text-primary mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          Esta carteirinha é pessoal e intransferível. O uso indevido está sujeito a penalidades conforme decreto municipal.
        </p>
      </div>
    </div>
  )
}

function AlertCircle(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

