import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from "@/integrations/supabase/client"

import { toast } from "sonner"
import logoAsset from "@/assets/logo.asset.json";


export const Route = createFileRoute('/entrar')({
  head: () => ({
    meta: [
      { title: "Entrar - EU PESCADOR!" },
      { name: "description", content: "Acesse sua conta para ver as condições do mar, avisos e gerenciar seu perfil." },
      { property: "og:title", content: "Entrar - EU PESCADOR!" },
      { property: "og:description", content: "Acesse sua conta e conecte-se com a Secretaria de Pesca de Paraty." },
    ],
  }),
  component: Entrar,
})

function Entrar() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()



  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      
      toast.success("Login realizado com sucesso!")
      navigate({ to: '/auth/callback' })
    } catch (error: any) {
      toast.error(error.message || "Erro ao entrar")
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
          <CardTitle className="text-3xl font-bold">Acessar</CardTitle>
          <CardDescription className="text-lg">Entre na sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <form onSubmit={handleEmailLogin} className="space-y-4">
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
              className="w-full h-14 text-lg font-bold rounded-2xl"
              disabled={loading}
            >
              {loading ? "ENTRANDO..." : "ENTRAR"}
            </Button>
          </form>

          
          <div className="pt-2 text-center">
            <p className="text-muted-foreground">
              Não tem conta? <Link to="/criar-conta" className="text-primary font-bold underline">Cadastre-se</Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

