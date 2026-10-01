import { getSignedOutUser, backendUnavailable } from '@/lib/backend-reset';
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, 
  Plus, 
  Ship, 
  Anchor,
  Edit,
  Eye,
  Star
} from "lucide-react"

import { useQuery } from "@tanstack/react-query"
import { Link } from '@tanstack/react-router'

export const Route = createFileRoute('/app/embarcacoes')({
  component: BoatsPage,
})

function BoatsPage() {
  const { data: boats, isLoading } = useQuery({
    queryKey: ['boats'],
    queryFn: async () => {
      const { data: { user } } = await getSignedOutUser()
      if (!user) return []
      
      const { data, error } = await backendUnavailable()
        
      if (error) throw error
      return data || []
    }
  })

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>

  return (
    <div className="p-6 space-y-8 pb-24 max-w-[430px] mx-auto">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/app/perfil">
              <ChevronLeft size={28} />
            </Link>
          </Button>
          <h2 className="text-2xl font-black tracking-tight">Embarcações</h2>
        </div>
        <Button asChild size="icon" className="rounded-full h-12 w-12 shadow-md">
          <Link to="/app/embarcacoes/nova">
            <Plus size={24} />
          </Link>
        </Button>
      </header>

      {boats && boats.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {boats.map((boat) => (
            <Card key={boat.id} className="border-2 rounded-[2rem] overflow-hidden shadow-md relative">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-600 shrink-0">
                      <Ship size={36} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                        {boat.name}
                        {boat.is_primary && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                            <Star size={12} className="mr-1 fill-amber-700" /> Principal
                          </Badge>
                        )}
                      </h3>
                      <p className="text-muted-foreground text-sm font-bold">Registro: {boat.registration_number || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2 border-y border-dashed">
                  <div>
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Tipo</p>
                    <p className="font-bold">{boat.boat_type || '-'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Motor</p>
                    <p className="font-bold">{boat.engine_brand || '-'} {boat.engine_power_hp ? `${boat.engine_power_hp} HP` : ''}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold gap-2">
                    <Eye size={16} /> VER
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 rounded-xl font-bold gap-2">
                    <Edit size={16} /> EDITAR
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
          <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center text-muted-foreground/30">
            <Anchor size={64} />
          </div>
          <div className="space-y-2 px-8">
            <h3 className="text-xl font-black uppercase tracking-tight">Você ainda não cadastrou uma embarcação.</h3>
            <p className="text-muted-foreground">Cadastre seu barco para ter acesso total aos recursos do app.</p>
          </div>
          <Button asChild className="rounded-2xl h-14 px-8 text-lg font-black uppercase tracking-widest shadow-lg">
            <Link to="/app/embarcacoes/nova">
              CADASTRAR MINHA EMBARCAÇÃO
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
