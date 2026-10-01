import { createFileRoute } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute('/app/configuracoes/privacidade')({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
        <div className="container flex items-center h-16 px-4">
          <Link to="/app/perfil" className="mr-4">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-bold">Privacidade e Termos</h1>
        </div>
      </header>

      <main className="container p-4 space-y-6">
        <section className="space-y-4">
          <div className="flex items-center gap-3 text-primary">
            <Shield className="h-6 w-6" />
            <h2 className="text-xl font-bold italic tracking-tight uppercase">LGPD e Seus Dados</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Como cuidamos dos seus dados</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <p>
                A Secretaria Municipal de Pesca de Paraty preza pela transparência e segurança das suas informações.
                Todos os dados coletados têm finalidades específicas de segurança e gestão pública.
              </p>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Dados de Localização</h3>
                <p>
                  Sua localização é coletada apenas durante o modo "Estou no Mar" para fins de segurança e monitoramento de salvamento.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">Seus Direitos</h3>
                <p>
                  Você pode solicitar a exclusão de seus dados ou revogar consentimentos a qualquer momento através desta plataforma ou presencialmente na Secretaria.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">Documentos Legais</h2>
          <div className="grid gap-3">
            <Button variant="outline" className="justify-start h-auto py-4 px-6 text-left">
              <div>
                <div className="font-bold">Política de Privacidade</div>
                <div className="text-xs text-muted-foreground">Versão 1.0 - Atualizado em 21/08/2026</div>
              </div>
            </Button>
            <Button variant="outline" className="justify-start h-auto py-4 px-6 text-left">
              <div>
                <div className="font-bold">Termos de Uso</div>
                <div className="text-xs text-muted-foreground">Versão 1.0 - Atualizado em 21/08/2026</div>
              </div>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
