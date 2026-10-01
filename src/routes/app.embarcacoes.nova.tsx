import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Ship,
  Settings,
  Zap,
  Fuel,
  MapPin,
  Check,
  Camera
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Link, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/app/embarcacoes/nova')({
  component: NewBoatPage,
})

function NewBoatPage() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: '',
    registration_number: '',
    boat_type: 'Barco',
    length_meters: '',
    hull_material: 'Madeira',
    color: '',
    engine_brand: '',
    engine_power_hp: '',
    fuel_type: 'Diesel',
    home_port: '',
    is_primary: false
  })

  const nextStep = () => setStep(s => Math.min(s + 5, 5))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const mutation = useMutation({
    mutationFn: async (boatData: any) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuário não autenticado")

      const { error } = await supabase
        .from('boats')
        .insert({
          ...boatData,
          owner_id: user.id,
          length_meters: boatData.length_meters ? parseFloat(boatData.length_meters) : null,
          engine_power_hp: boatData.engine_power_hp ? parseFloat(boatData.engine_power_hp) : null,
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boats'] })
      toast.success("Embarcação cadastrada com sucesso!")
      navigate({ to: '/app/embarcacoes' })
    },
    onError: (error: any) => {
      toast.error(`Erro ao cadastrar: ${error.message}`)
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = () => {
    mutation.mutate(formData)
  }

  return (
    <div className="p-6 space-y-8 pb-24 max-w-[430px] mx-auto min-h-screen bg-background">
      <header className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost" size="icon" className="rounded-full">
            <Link to="/app/embarcacoes">
              <ChevronLeft size={28} />
            </Link>
          </Button>
          <h2 className="text-2xl font-black tracking-tight">Nova Embarcação</h2>
        </div>
        
        <div className="flex gap-2 px-1">
          {[1, 2, 3, 4, 5].map(s => (
            <div 
              key={s} 
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-primary' : 'bg-muted'}`} 
            />
          ))}
        </div>
      </header>

      <Card className="border-2 rounded-[2rem] overflow-hidden shadow-lg">
        <CardContent className="p-8 space-y-8">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Ship size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Identificação</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da embarcação</Label>
                  <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ex: Santa Luzia" className="h-12 rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="registration_number">Número de registro (Marinha)</Label>
                  <Input id="registration_number" value={formData.registration_number} onChange={handleChange} placeholder="Ex: RJ-12345" className="h-12 rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="boat_type">Tipo</Label>
                  <select 
                    id="boat_type" 
                    value={formData.boat_type}
                    onChange={(e) => handleSelectChange('boat_type', e.target.value)}
                    className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {['Canoa', 'Bote', 'Barco', 'Traineira', 'Lancha', 'Outro'].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Settings size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Características</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="length_meters">Comprimento (metros)</Label>
                  <Input id="length_meters" type="number" step="0.1" value={formData.length_meters} onChange={handleChange} className="h-12 rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hull_material">Material do casco</Label>
                  <select 
                    id="hull_material" 
                    value={formData.hull_material}
                    onChange={(e) => handleSelectChange('hull_material', e.target.value)}
                    className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {['Madeira', 'Fibra', 'Alumínio', 'Outro'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Cor predominante</Label>
                  <Input id="color" value={formData.color} onChange={handleChange} className="h-12 rounded-xl border-2" />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Zap size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Motor</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="engine_brand">Marca do motor</Label>
                  <Input id="engine_brand" value={formData.engine_brand} onChange={handleChange} placeholder="Ex: Yamaha" className="h-12 rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engine_power_hp">Potência (HP)</Label>
                  <Input id="engine_power_hp" type="number" value={formData.engine_power_hp} onChange={handleChange} className="h-12 rounded-xl border-2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuel_type">Combustível</Label>
                  <select 
                    id="fuel_type" 
                    value={formData.fuel_type}
                    onChange={(e) => handleSelectChange('fuel_type', e.target.value)}
                    className="flex h-12 w-full rounded-xl border-2 border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    {['Diesel', 'Gasolina', 'Outro'].map(f => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Base</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="home_port">Local/porto de saída habitual</Label>
                  <Input id="home_port" value={formData.home_port} onChange={handleChange} placeholder="Ex: Cais de Santa Rita" className="h-12 rounded-xl border-2" />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6 text-center">
              <div className="flex flex-col items-center gap-2 mb-4">
                <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Camera size={32} />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight">Foto</h3>
              </div>

              <div className="aspect-square w-full max-w-[200px] mx-auto rounded-[2rem] bg-muted border-4 border-dashed border-muted-foreground/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/70 transition-colors">
                <Plus size={40} className="text-muted-foreground/40" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Adicionar Foto</span>
              </div>
              
              <p className="text-xs text-muted-foreground px-4">
                A foto ajuda na identificação rápida pela secretaria e fiscalização. (Opcional)
              </p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} className="h-14 w-14 rounded-2xl border-2 shrink-0">
                <ChevronLeft />
              </Button>
            )}
            {step < 5 ? (
              <Button onClick={() => setStep(step + 1)} className="h-14 flex-1 text-lg font-black uppercase tracking-widest rounded-2xl shadow-md">
                PRÓXIMO <ChevronRight className="ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={mutation.isPending} className="h-14 flex-1 text-lg font-black uppercase tracking-widest rounded-2xl bg-green-600 hover:bg-green-700 text-white shadow-lg">
                {mutation.isPending ? "SALVANDO..." : (
                  <>CONCLUIR CADASTRO <Check className="ml-2" /></>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
