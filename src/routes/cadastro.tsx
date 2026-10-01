import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"

export const Route = createFileRoute('/cadastro')({
  head: () => ({
    meta: [
      { title: "Cadastro de Pescador - EU PESCADOR!" },
      { name: "description", content: "Realize seu cadastro municipal de pescador em Paraty e tenha acesso a benefícios e informações." },
      { property: "og:title", content: "Cadastro de Pescador - EU PESCADOR!" },
      { property: "og:description", content: "Faça parte da plataforma oficial dos pescadores de Paraty." },
    ],
  }),
  component: Cadastro,
})

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { profileService } from "@/lib/profile-service"
import { useNavigate } from "@tanstack/react-router"
import { toast } from "sonner"

const cadastroSchema = z.object({
  full_name: z.string().min(3, "Nome muito curto"),
  cpf: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  community: z.string().min(2, "Comunidade obrigatória"),
  locality: z.string().min(2, "Bairro obrigatório"),
  fishing_type: z.string(),
  emergency_contact_name: z.string().min(3, "Nome do contato obrigatório"),
  emergency_contact_phone: z.string().min(10, "Telefone do contato inválido"),
  emergency_contact_relation: z.string().min(2, "Parentesco obrigatório"),
})

type CadastroForm = z.infer<typeof cadastroSchema>

function Cadastro() {
  const [step, setStep] = useState(1)
  const navigate = useNavigate()
  
  const form = useForm<CadastroForm>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      fishing_type: "artesanal"
    }
  })

  const nextStep = async () => {
    // Validar campos do passo atual antes de prosseguir
    let fields: (keyof CadastroForm)[] = []
    if (step === 1) fields = ['full_name', 'cpf', 'phone']
    if (step === 2) fields = ['community', 'locality']
    if (step === 4) fields = ['emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation']
    
    if (fields.length > 0) {
      const isValid = await form.trigger(fields)
      if (!isValid) return
    }
    
    setStep(s => Math.min(s + 1, 4))
  }
  
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const onSubmit = async (data: CadastroForm) => {
    try {
      const result = await profileService.updateMyProfile(data)
      
      if (result.success) {
        toast.success("Cadastro concluído com sucesso!")
        navigate({ to: "/app" })
      } else {
        toast.error(result.error?.message || "Erro ao salvar cadastro.")
        if (result.error?.code === "AUTH_EXPIRED") {
          navigate({ to: "/entrar" })
        }
      }
    } catch (error: any) {
      toast.error("Ocorreu um erro inesperado. Tente novamente.")
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center">
      <header className="w-full max-w-[430px] mb-8">
        <h1 className="text-2xl font-bold">Cadastro</h1>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? 'bg-primary' : 'bg-muted'}`} 
            />
          ))}
        </div>
      </header>

      <Card className="w-full max-w-[430px] border-2 rounded-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">
            {step === 1 && "Seus dados"}
            {step === 2 && "Onde você mora ou pesca?"}
            {step === 3 && "Sua atividade"}
            {step === 4 && "Contato de emergência"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-lg">Nome completo</Label>
                <Input id="name" placeholder="Ex: João da Silva" className="h-12 text-lg rounded-xl" {...form.register("full_name")} />
                {form.formState.errors.full_name && <p className="text-destructive text-sm">{form.formState.errors.full_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-lg">CPF</Label>
                <Input id="cpf" placeholder="000.000.000-00" className="h-12 text-lg rounded-xl" {...form.register("cpf")} />
                {form.formState.errors.cpf && <p className="text-destructive text-sm">{form.formState.errors.cpf.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-lg">Celular</Label>
                <Input id="phone" placeholder="(24) 99999-9999" className="h-12 text-lg rounded-xl" {...form.register("phone")} />
                {form.formState.errors.phone && <p className="text-destructive text-sm">{form.formState.errors.phone.message}</p>}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="community" className="text-lg">Comunidade</Label>
                <Input id="community" placeholder="Ex: Trindade" className="h-12 text-lg rounded-xl" {...form.register("community")} />
                {form.formState.errors.community && <p className="text-destructive text-sm">{form.formState.errors.community.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="locality" className="text-lg">Bairro/localidade</Label>
                <Input id="locality" placeholder="Ex: Centro" className="h-12 text-lg rounded-xl" {...form.register("locality")} />
                {form.formState.errors.locality && <p className="text-destructive text-sm">{form.formState.errors.locality.message}</p>}
              </div>
            </div>
          )}

          {step === 3 && (
            <RadioGroup 
              defaultValue="artesanal" 
              className="space-y-3"
              onValueChange={(v) => form.setValue("fishing_type", v)}
            >
              {['Artesanal', 'Profissional', 'Amador', 'Marisqueiro', 'Outro'].map(type => (
                <Label
                  key={type}
                  className="flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer hover:bg-accent transition-colors"
                >
                  <span className="text-lg font-medium">{type}</span>
                  <RadioGroupItem value={type.toLowerCase()} />
                </Label>
              ))}
            </RadioGroup>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="e-name" className="text-lg">Nome do contato</Label>
                <Input id="e-name" className="h-12 text-lg rounded-xl" {...form.register("emergency_contact_name")} />
                {form.formState.errors.emergency_contact_name && <p className="text-destructive text-sm">{form.formState.errors.emergency_contact_name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-phone" className="text-lg">Telefone</Label>
                <Input id="e-phone" className="h-12 text-lg rounded-xl" {...form.register("emergency_contact_phone")} />
                {form.formState.errors.emergency_contact_phone && <p className="text-destructive text-sm">{form.formState.errors.emergency_contact_phone.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="e-relation" className="text-lg">Parentesco</Label>
                <Input id="e-relation" className="h-12 text-lg rounded-xl" {...form.register("emergency_contact_relation")} />
                {form.formState.errors.emergency_contact_relation && <p className="text-destructive text-sm">{form.formState.errors.emergency_contact_relation.message}</p>}
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} className="h-14 w-14 rounded-2xl border-2 shrink-0">
                <ChevronLeft />
              </Button>
            )}
            {step < 4 ? (
              <Button onClick={nextStep} className="h-14 flex-1 text-lg font-bold rounded-2xl">
                PRÓXIMO <ChevronRight className="ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={form.handleSubmit(onSubmit)}
                className="h-14 flex-1 text-lg font-bold rounded-2xl bg-green-600 hover:bg-green-700 text-white"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "SALVANDO CADASTRO..." : "CONCLUIR CADASTRO"} <Check className="ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
