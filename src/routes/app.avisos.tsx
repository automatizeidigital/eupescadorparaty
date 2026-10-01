import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getNotices } from '@/lib/notices.functions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, MapPin, Calendar, Info, AlertTriangle, Shield, Fish, Building, ExternalLink } from 'lucide-react';

export const Route = createFileRoute('/app/avisos')({
  head: () => ({
    meta: [
      { title: "Central de Avisos - Paraty | EU PESCADOR!" },
      { name: "description", content: "Comunicações oficiais da Secretaria de Pesca e Prefeitura de Paraty." },
      { property: "og:title", content: "Central de Avisos - Paraty" },
      { property: "og:description", content: "Fique por dentro das últimas notícias e alertas da pesca em Paraty." },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AvisosPage,
});

const CATEGORY_ICONS: Record<string, any> = {
  secretaria_pesca: Fish,
  prefeitura: Building,
  seguranca: Shield,
  clima: Bell,
  evento: Calendar,
  beneficio: Info,
  documentacao: Info,
  defeso: Fish,
  saude: Bell,
  meio_ambiente: Shield,
  outro: Bell,
};

const CATEGORY_LABELS: Record<string, string> = {
  secretaria_pesca: 'Secretaria de Pesca',
  prefeitura: 'Prefeitura',
  seguranca: 'Segurança',
  clima: 'Clima',
  evento: 'Eventos',
  beneficio: 'Benefícios',
  documentacao: 'Documentação',
  defeso: 'Defeso',
  saude: 'Saúde',
  meio_ambiente: 'Meio Ambiente',
  outro: 'Outro',
};

function NoticeCard({ notice }: { notice: any }) {
  const Icon = CATEGORY_ICONS[notice.category] || Bell;
  const isCritical = notice.priority === 'critical';
  const isHigh = notice.priority === 'high';

  return (
    <Link to="/app/avisos/$id" params={{ id: notice.id }} className="block no-underline">
      <Card className={`mb-4 overflow-hidden border-l-4 transition-all hover:shadow-md ${
        isCritical ? 'border-l-destructive bg-destructive/5' : 
        isHigh ? 'border-l-orange-500 bg-orange-50' : 
        'border-l-primary'
      }`}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Badge variant={isCritical ? "destructive" : "outline"} className="flex items-center gap-1 text-[10px] py-0">
                <Icon size={12} />
                {CATEGORY_LABELS[notice.category]}
              </Badge>
              {notice.pinned && (
                <Badge variant="secondary" className="text-[10px] py-0">
                  📌 Fixado
                </Badge>
              )}
            </div>
            <span className="text-[10px] text-muted-foreground">
              {notice.published_at ? format(new Date(notice.published_at), 'dd/MM HH:mm', { locale: ptBR }) : ''}
            </span>
          </div>
          
          <CardTitle className={`text-base font-bold mb-1 ${isCritical ? 'text-destructive' : ''}`}>
            {isCritical && '🔴 '}
            {notice.title}
          </CardTitle>
          
          {notice.summary && (
            <CardDescription className="text-sm line-clamp-2 mb-2 text-foreground/80">
              {notice.summary}
            </CardDescription>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed">
            <span className="text-[10px] font-medium text-muted-foreground uppercase flex items-center gap-1">
              Fonte: {notice.source_name || 'EU PESCADOR!'}
            </span>
            <div className="text-primary text-[10px] font-bold flex items-center gap-1">
              Ver mais <ExternalLink size={10} />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

function AvisosPage() {
  const { data: notices } = useSuspenseQuery({
    queryKey: ['notices'],
    queryFn: () => getNotices({ data: { limit: 50 } }),
  });

  const alerts = notices.filter(n => ['seguranca', 'clima', 'saude'].includes(n.category) || n.priority === 'critical');
  const pesca = notices.filter(n => n.category === 'secretaria_pesca' || n.category === 'defeso');
  const prefeitura = notices.filter(n => n.category === 'prefeitura' || n.category === 'evento');
  const eventos = notices.filter(n => n.category === 'evento');

  return (
    <div className="pb-24 animate-in fade-in duration-500">
      <div className="bg-primary text-primary-foreground p-6 pt-12 rounded-b-[2rem] shadow-lg mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Bell className="animate-bounce" /> Central de Avisos
        </h1>
        <p className="text-primary-foreground/80 text-sm mt-1">
          Comunicações oficiais e alertas para o pescador.
        </p>
      </div>

      <div className="px-4">
        <Tabs defaultValue="todos" className="w-full">
          <TabsList className="grid grid-cols-5 w-full mb-6 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="todos" className="text-[10px] px-1 rounded-lg">Todos</TabsTrigger>
            <TabsTrigger value="pesca" className="text-[10px] px-1 rounded-lg">Pesca</TabsTrigger>
            <TabsTrigger value="prefeitura" className="text-[10px] px-1 rounded-lg">Cidade</TabsTrigger>
            <TabsTrigger value="alertas" className="text-[10px] px-1 rounded-lg">Alertas</TabsTrigger>
            <TabsTrigger value="eventos" className="text-[10px] px-1 rounded-lg">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            {notices.length > 0 ? (
              notices.map(notice => <NoticeCard key={notice.id} notice={notice} />)
            ) : (
              <EmptyState />
            )}
          </TabsContent>

          <TabsContent value="pesca">
            {pesca.length > 0 ? (
              pesca.map(notice => <NoticeCard key={notice.id} notice={notice} />)
            ) : (
              <EmptyState message="Nenhum aviso da Secretaria no momento." />
            )}
          </TabsContent>

          <TabsContent value="prefeitura">
            {prefeitura.length > 0 ? (
              prefeitura.map(notice => <NoticeCard key={notice.id} notice={notice} />)
            ) : (
              <EmptyState message="Nenhum comunicado da Prefeitura no momento." />
            )}
          </TabsContent>

          <TabsContent value="alertas">
            {alerts.length > 0 ? (
              alerts.map(notice => <NoticeCard key={notice.id} notice={notice} />)
            ) : (
              <EmptyState message="Não há alertas urgentes hoje." />
            )}
          </TabsContent>

          <TabsContent value="eventos">
            {eventos.length > 0 ? (
              eventos.map(notice => <NoticeCard key={notice.id} notice={notice} />)
            ) : (
              <EmptyState message="Nenhum evento programado." />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function EmptyState({ message = "Tudo tranquilo! Nenhum aviso por enquanto." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground opacity-60">
      <Bell size={48} className="mb-4" />
      <p className="text-sm px-8">{message}</p>
    </div>
  );
}
