import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import logoAsset from "@/assets/logo.asset.json";

export const Route = createFileRoute('/criar-conta')({
  head: () => ({
    meta: [
      { title: "Criar Conta - EU PESCADOR!" },
      { name: "description", content: "Crie sua conta na plataforma oficial dos pescadores de Paraty." },
    ],
  }),
  component: CriarConta,
})

function CriarConta() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) throw error
      
      toast.success("Conta criada! Verifique seu e-mail para confirmar.")
      navigate({ to: '/entrar' })
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-[400px] border-2 shadow-xl rounded-3xl">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            <img src={logoAsset.url} alt="Logo EU PESCADOR!" className="w-24 h-auto" />
          </div>
          <CardTitle className="text-3xl font-bold">Criar Conta</CardTitle>
          <CardDescription>Use seu e-mail para começar</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl"
              />
            </div>
            <Button 
              type="submit"
              className="w-full h-14 text-lg font-bold rounded-2xl mt-4"
              disabled={loading}
            >
              {loading ? "CRIANDO..." : "CRIAR CONTA"}
            </Button>
            
            <div className="pt-4 text-center">
              <p className="text-muted-foreground text-sm">
                Já tem uma conta? <a href="/entrar" className="text-primary font-bold underline">Entre aqui</a>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
