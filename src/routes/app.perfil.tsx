import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  UserRound, 
  Ship, 
  CreditCard, 
  FileText, 
  Calendar, 
  Fish,
  ChevronRight,
  LogOut,
  Camera,
  Bell,
  ShieldCheck
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useQuery } from "@tanstack/react-query"
import { toast } from "sonner"
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/app/perfil')({
  head: () => ({
    meta: [
      { title: "Minha Área - EU PESCADOR!" },
      { name: "description", content: "Gerencie seu perfil de pescador, embarcações e documentos em Paraty." },
      { property: "og:title", content: "Minha Área - EU PESCADOR!" },
      { property: "og:description", content: "Acesse seu cadastro municipal e frota pesqueira." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProfilePage,
})

function ProfilePage() {
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

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error("Erro ao sair")
    } else {
      window.location.href = "/"
    }
  }

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>

  const isRegistrationComplete = profile?.registration_completed
  const maskedCpf = profile?.cpf ? `***.***.***-${profile.cpf.slice(-2)}` : 'Não informado'

  return (
    <div className="p-6 space-y-8 pb-24 max-w-[430px] mx-auto">
      <header className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Foto do pescador" className="h-full w-full object-cover" />
            ) : (
              <User size={48} className="text-muted-foreground" />
            )}
          </div>
          <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-md">
            <Camera size={16} />
          </Button>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight">{profile?.full_name || 'Pescador'}</h2>
          <div className="flex flex-col items-center gap-2">
            {isRegistrationComplete ? (
              <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100">
                🟢 Cadastro ativo
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-100">
                🟡 Cadastro incompleto
              </Badge>
            )}
            <p className="text-sm font-mono text-muted-foreground">CPF: {maskedCpf}</p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4">
        <h3 className="text-lg font-black uppercase tracking-widest text-primary/80 px-2">Minha Área</h3>
        
        {/* Meus Dados */}
        <Link to="/app/perfil/dados">
          <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                <UserRound size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Meus Dados</h4>
                <p className="text-muted-foreground text-xs">Informações pessoais e contato.</p>
              </div>
              <ChevronRight size={24} className="text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* Minhas Embarcações */}
        <Link to="/app/embarcacoes">
          <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0">
                <Ship size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Minhas Embarcações</h4>
                <p className="text-muted-foreground text-xs">Gestão da frota e barcos.</p>
              </div>
              <ChevronRight size={24} className="text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* Minha Carteirinha */}
        <Link to="/app/carteirinha">
          <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <CreditCard size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Minha Carteirinha</h4>
                <p className="text-muted-foreground text-xs">Carteira digital municipal.</p>
              </div>
              <ChevronRight size={24} className="text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* Notificações */}
        <Link to="/app/configuracoes/notificacoes">
          <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <Bell size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Notificações</h4>
                <p className="text-muted-foreground text-xs">Alertas e preferências.</p>
              </div>
              <ChevronRight size={24} className="text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
        
        {/* Privacidade e Termos */}
        <Link to="/app/configuracoes/privacidade">
          <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-shadow active:scale-[0.98]">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
                <ShieldCheck size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg">Privacidade e Termos</h4>
                <p className="text-muted-foreground text-xs">Gestão de dados e LGPD.</p>
              </div>
              <ChevronRight size={24} className="text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        {/* Meus Documentos */}
        <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm opacity-70">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <FileText size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Meus Documentos</h4>
              <p className="text-orange-600 text-xs font-black uppercase">Em breve</p>
            </div>
          </CardContent>
        </Card>

        {/* Calendário */}
        <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm opacity-70">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
              <Calendar size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Calendário</h4>
              <p className="text-indigo-600 text-xs font-black uppercase">Em breve</p>
            </div>
          </CardContent>
        </Card>

        {/* Defeso */}
        <Card className="border-2 rounded-[1.5rem] overflow-hidden shadow-sm opacity-70">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-red-50 flex items-center justify-center text-red-600 shrink-0">
              <Fish size={28} />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">Defeso</h4>
              <p className="text-red-600 text-xs font-black uppercase">Em breve</p>
            </div>
          </CardContent>
        </Card>

        <Button 
          variant="ghost" 
          className="w-full text-destructive hover:bg-destructive/10 rounded-xl h-12 gap-2 mt-4"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          Sair da conta
        </Button>
      </div>
    </div>
  )
}
