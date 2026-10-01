import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { getNoticeById } from '@/lib/notices.functions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, User, ExternalLink, Fish, Building, Shield, Bell, Info } from 'lucide-react';

export const Route = createFileRoute('/app/avisos/$id')({
  component: AvisoDetailPage,
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

function AvisoDetailPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  
  const { data: notice } = useSuspenseQuery({
    queryKey: ['notice', id],
    queryFn: () => getNoticeById({ data: id }),
  });

  const Icon = CATEGORY_ICONS[notice.category] || Bell;
  const isCritical = notice.priority === 'critical';

  return (
    <div className="pb-24 animate-in slide-in-from-right duration-300">
      <div className="relative h-48 bg-primary overflow-hidden">
        {notice.image_url ? (
          <img 
            src={notice.image_url} 
            alt={notice.title} 
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center opacity-20">
            <Icon size={80} className="text-white" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 bg-black/20 text-white rounded-full hover:bg-black/40"
          onClick={() => navigate({ to: '/app/avisos' })}
        >
          <ArrowLeft size={20} />
        </Button>
      </div>

      <div className="px-6 -mt-8 relative z-10">
        <div className="bg-card rounded-3xl p-6 shadow-xl border">
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant={isCritical ? "destructive" : "outline"} className="flex items-center gap-1">
              <Icon size={12} />
              {CATEGORY_LABELS[notice.category]}
            </Badge>
            {notice.pinned && (
              <Badge variant="secondary">
                📌 Fixado
              </Badge>
            )}
            <Badge variant="secondary" className="bg-muted">
              {notice.priority.toUpperCase()}
            </Badge>
          </div>

          <h1 className={`text-2xl font-bold leading-tight mb-4 ${isCritical ? 'text-destructive' : ''}`}>
            {isCritical && '🔴 '}
            {notice.title}
          </h1>

          <div className="flex flex-col gap-2 text-sm text-muted-foreground mb-6 border-b pb-6">
            <div className="flex items-center gap-2">
              <Calendar size={14} />
              <span>{notice.published_at ? format(new Date(notice.published_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : 'Data não informada'}</span>
            </div>
            <div className="flex items-center gap-2">
              <User size={14} />
              <span>Fonte: {notice.source_name || 'EU PESCADOR!'}</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {notice.content}
          </div>

          {notice.source_url && (
            <div className="mt-8">
              <Button asChild className="w-full rounded-xl gap-2 h-12">
                <a href={notice.source_url} target="_blank" rel="noopener noreferrer">
                  Ver fonte original <ExternalLink size={16} />
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
