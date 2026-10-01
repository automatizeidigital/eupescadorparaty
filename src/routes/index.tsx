import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ship, Map, Bell, User, CloudRain } from "lucide-react";
import logoAsset from "@/assets/logo.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EU PESCADOR! - Secretaria Municipal de Pesca de Paraty" },
      { name: "description", content: "Sistema destinado aos pescadores do Município de Paraty. Acesse as condições do mar, avisos e gerencie seu perfil." },
      { property: "og:title", content: "EU PESCADOR! - Paraty" },
      { property: "og:description", content: "Plataforma oficial da Secretaria Municipal de Pesca de Paraty – RJ." },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <header className="mb-12">
        <div className="flex justify-center mb-6">
          <img src={logoAsset.url} alt="Logo EU PESCADOR!" className="w-48 h-auto" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-2">
          EU PESCADOR!
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Secretaria Municipal de Pesca de Paraty – RJ
        </p>
      </header>

      <main className="w-full max-w-[430px] space-y-4">
        <Card className="border-2 border-primary/20 bg-card shadow-lg overflow-hidden">
          <CardContent className="p-8 space-y-6">
            <p className="text-lg leading-relaxed text-muted-foreground">
              Sistema destinado aos pescadores do Município de Paraty.
              Acesse sua conta para ver as condições do mar, avisos e gerenciar seu perfil.
            </p>
            
            <div className="flex flex-col gap-4">
              <Button asChild size="lg" className="w-full h-16 text-xl font-bold rounded-2xl shadow-md">
                <Link to="/entrar">ENTRAR</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full h-16 text-xl font-bold rounded-2xl border-2">
                <Link to="/cadastro">CADASTRAR</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="pt-8 grid grid-cols-2 gap-4 opacity-50 select-none grayscale pointer-events-none">
          <div className="flex flex-col items-center gap-1 text-xs">
            <CloudRain size={24} />
            <span>Clima</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-xs">
            <Map size={24} />
            <span>Mapa</span>
          </div>
        </div>
      </main>

      <footer className="mt-auto py-8 text-sm text-muted-foreground/60">
        © {new Date().getFullYear()} Prefeitura de Paraty
      </footer>
    </div>
  );
}
