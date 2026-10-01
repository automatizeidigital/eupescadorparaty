import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotificationPreferences, updateNotificationPreferences } from '@/lib/notifications.functions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Shield, Cloud, Waves, Navigation, Info, Clock, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export const Route = createFileRoute('/app/configuracoes/notificacoes')({
  head: () => ({
    meta: [
      { title: "Notificações - EU PESCADOR!" },
      { name: "description", content: "Gerencie suas preferências de notificações e alertas." },
    ],
  }),
  component: NotificationConfigPage,
});

function PreferenceItem({ 
  icon: Icon, 
  title, 
  description, 
  enabled, 
  onToggle,
  disabled = false
}: { 
  icon: any, 
  title: string, 
  description: string, 
  enabled: boolean, 
  onToggle: (val: boolean) => void,
  disabled?: boolean
}) {
  return (
    <div className="flex items-start justify-between py-4 border-b last:border-0 border-muted">
      <div className="flex gap-3">
        <div className="mt-1 p-2 rounded-xl bg-primary/10 text-primary">
          <Icon size={18} />
        </div>
        <div>
          <Label className="text-sm font-bold block mb-0.5">{title}</Label>
          <span className="text-[10px] text-muted-foreground leading-tight block pr-4">
            {description}
          </span>
        </div>
      </div>
      <Switch 
        checked={enabled} 
        onCheckedChange={onToggle} 
        disabled={disabled}
      />
    </div>
  );
}

function NotificationConfigPage() {
  const queryClient = useQueryClient();
  const { data: prefs, isLoading } = useQuery({
    queryKey: ['notification-prefs'],
    queryFn: () => getNotificationPreferences({}),
  });

  const mutation = useMutation({
    mutationFn: (data: any) => updateNotificationPreferences({ data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-prefs'] });
      toast.success("Preferências salvas!");
    },
    onError: () => {
      toast.error("Erro ao salvar preferências.");
    }
  });

  if (isLoading || !prefs) {
    return (
      <div className="p-6 text-center animate-pulse">
        <div className="h-8 w-48 bg-muted rounded mx-auto mb-6" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-muted rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-[430px] mx-auto pb-24">
      <header className="space-y-2">
        <h2 className="text-3xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Bell className="text-primary" /> Notificações
        </h2>
        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest opacity-70">
          Gerencie o que você deseja receber
        </p>
      </header>

      <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md">
        <CardContent className="p-6 divide-y divide-muted">
          <PreferenceItem 
            icon={Info}
            title="Avisos da Secretaria"
            description="Editais, prazos e avisos oficiais da Secretaria de Pesca."
            enabled={prefs.secretaria_enabled}
            onToggle={(val) => mutation.mutate({ secretaria_enabled: val })}
          />
          <PreferenceItem 
            icon={Shield}
            title="Segurança e SOS"
            description="Alertas críticos e atualizações de incidentes (recomendado manter ativo)."
            enabled={prefs.sos_enabled}
            onToggle={(val) => mutation.mutate({ sos_enabled: val })}
          />
          <PreferenceItem 
            icon={Cloud}
            title="Tempo e Condições"
            description="Alertas de mau tempo, vento forte e ressaca."
            enabled={prefs.weather_enabled}
            onToggle={(val) => mutation.mutate({ weather_enabled: val })}
          />
          <PreferenceItem 
            icon={Waves}
            title="Tábua de Maré"
            description="Lembretes sobre as mudanças significativas de maré."
            enabled={prefs.marine_enabled}
            onToggle={(val) => mutation.mutate({ marine_enabled: val })}
          />
          <PreferenceItem 
            icon={Navigation}
            title="Lembretes de Viagem"
            description="Avisos sobre o tempo de retorno e modo 'No Mar'."
            enabled={prefs.trip_enabled}
            onToggle={(val) => mutation.mutate({ trip_enabled: val })}
          />
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
          <Clock size={20} className="text-primary" /> Quiet Hours
        </h3>
        
        <Card className="border-2 rounded-[2rem] overflow-hidden shadow-md">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-sm font-bold block mb-0.5">Não incomodar</Label>
                <span className="text-[10px] text-muted-foreground leading-tight block">
                  Silenciar avisos não críticos durante o horário definido.
                </span>
              </div>
              <Switch 
                checked={prefs.quiet_hours_enabled} 
                onCheckedChange={(val) => mutation.mutate({ quiet_hours_enabled: val })}
              />
            </div>

            {prefs.quiet_hours_enabled && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Início</Label>
                  <Input 
                    type="time" 
                    className="rounded-xl border-2" 
                    value={prefs.quiet_hours_start || "22:00"}
                    onChange={(e) => mutation.mutate({ quiet_hours_start: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest ml-1">Fim</Label>
                  <Input 
                    type="time" 
                    className="rounded-xl border-2" 
                    value={prefs.quiet_hours_end || "06:00"}
                    onChange={(e) => mutation.mutate({ quiet_hours_end: e.target.value })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <div className="bg-muted/50 p-4 rounded-2xl flex gap-3 items-start border border-muted">
        <AlertTriangle size={20} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          Notificações críticas de segurança e avisos oficiais urgentes ignoram o modo 'Não incomodar' para garantir sua proteção.
        </p>
      </div>
    </div>
  );
}
