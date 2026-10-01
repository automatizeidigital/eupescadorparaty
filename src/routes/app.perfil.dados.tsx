import { getSignedOutUser, backendUnavailable } from '@/lib/backend-reset';
import { createFileRoute } from '@tanstack/react-router'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft,
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/app/perfil/dados')({
  component: ProfileDataPage,
})

function ProfileDataPage() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<any>({})

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await getSignedOutUser()
      if (!user) return null
      
      const { data, error } = await backendUnavailable()
        
      if (error) throw error
      return data
    }
  })

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        nickname: profile.nickname || '',
        birth_date: profile.birth_date || '',
        phone: profile.phone || '',
        address: profile.address || '',
        community: profile.community || '',
        neighborhood: profile.neighborhood || '',
        cep: profile.cep || '',
        city: profile.city || 'Paraty',
        state: profile.state || 'RJ',
        fisher_type: profile.fisher_type || '',
        fisher_registration: profile.fisher_registration || '',
        emergency_contact_name: profile.emergency_contact_name || '',
        emergency_contact_phone: profile.emergency_contact_phone || '',
        emergency_contact_relation: profile.emergency_contact_relation || '',
      })
    }
  }, [profile])

  const mutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const { data: { user } } = await getSignedOutUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { error } = await backendUnavailable()

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] })
      toast.success("Dados atualizados com sucesso!", {
        icon: <CheckCircle2 className="text-green-500" />,
      })
    },
    onError: (error: any) => {
      toast.error(`Erro ao atualizar: ${error.message}`, {
        icon: <AlertCircle className="text-destructive" />,
      })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev: any) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  if (isLoading) return <div className="p-8 text-center">Carregando...</div>

  return (
    <div className="p-6 space-y-8 pb-24 max-w-[430px] mx-auto">
      <header className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="rounded-full">
          <Link to="/app/perfil">
            <ChevronLeft size={28} />
          </Link>
        </Button>
        <h2 className="text-2xl font-black tracking-tight">Meus Dados</h2>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Bloco 1: Dados Pessoais */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 px-1">Dados Pessoais</h3>
          <Card className="border-2 rounded-3xl overflow-hidden shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nome completo</Label>
                <Input id="full_name" value={formData.full_name || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nickname">Apelido (como é conhecido)</Label>
                <Input id="nickname" value={formData.nickname || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="birth_date">Nascimento</Label>
                  <Input id="birth_date" type="date" value={formData.birth_date || ''} onChange={handleChange} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Celular</Label>
                  <Input id="phone" value={formData.phone || ''} onChange={handleChange} className="h-12 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bloco 2: Localização */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 px-1">Localização</h3>
          <Card className="border-2 rounded-3xl overflow-hidden shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community">Comunidade</Label>
                <Input id="community" value={formData.community || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input id="neighborhood" value={formData.neighborhood || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <Input id="address" value={formData.address || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" value={formData.cep || ''} onChange={handleChange} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={formData.city || ''} readOnly className="h-12 rounded-xl bg-muted" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bloco 3: Atividade Pesqueira */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 px-1">Atividade Pesqueira</h3>
          <Card className="border-2 rounded-3xl overflow-hidden shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fisher_type">Tipo de pescador</Label>
                <Input id="fisher_type" value={formData.fisher_type || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fisher_registration">Registro profissional (RGP)</Label>
                <Input id="fisher_registration" value={formData.fisher_registration || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bloco 4: Emergência */}
        <section className="space-y-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-primary/70 px-1">Emergência</h3>
          <Card className="border-2 rounded-3xl overflow-hidden shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">Nome do contato</Label>
                <Input id="emergency_contact_name" value={formData.emergency_contact_name || ''} onChange={handleChange} className="h-12 rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_phone">Telefone</Label>
                  <Input id="emergency_contact_phone" value={formData.emergency_contact_phone || ''} onChange={handleChange} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergency_contact_relation">Relação</Label>
                  <Input id="emergency_contact_relation" value={formData.emergency_contact_relation || ''} onChange={handleChange} className="h-12 rounded-xl" />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <Button 
          type="submit" 
          className="w-full h-14 rounded-2xl text-lg font-black uppercase tracking-widest gap-2 shadow-lg"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Salvando..." : (
            <>
              <Save size={20} />
              Salvar Alterações
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
