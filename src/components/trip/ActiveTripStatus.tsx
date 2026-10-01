import { useState } from 'react';
import { FishingTrip } from '@/lib/map.types';
import { 
  evaluateTripMonitoring, 
  confirmFisherAtSea, 
  updateTripReturnTime 
} from '@/lib/trip-monitoring.functions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle2, Navigation, Anchor } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface ActiveTripStatusProps {
  trip: FishingTrip;
  onTripEnd: () => void;
}

export function ActiveTripStatus({ trip, onTripEnd }: ActiveTripStatusProps) {
  const monitoring = evaluateTripMonitoring(trip);
  const queryClient = useQueryClient();
  const [isTimeDialogOpen, setIsTimeDialogOpen] = useState(false);
  const [newTime, setNewTime] = useState('');
  const [reason, setReason] = useState('');

  const confirmMutation = useMutation({
    mutationFn: () => confirmFisherAtSea({ data: { tripId: trip.id } }),
    onSuccess: () => {
      toast.success("Presença confirmada!");
      queryClient.invalidateQueries({ queryKey: ['active-trip'] });
    }
  });

  const updateTimeMutation = useMutation({
    mutationFn: () => updateTripReturnTime({ 
      data: { 
        tripId: trip.id, 
        newReturnTime: newTime,
        reason 
      } 
    }),
    onSuccess: () => {
      toast.success("Previsão atualizada!");
      setIsTimeDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['active-trip'] });
    }
  });

  const handleUpdateTime = () => {
    if (!newTime) return;
    const date = new Date(trip.expected_return_at || new Date());
    const [hours, minutes] = (newTime || "00:00").split(':');
    date.setHours(parseInt(hours || "0"), parseInt(minutes || "0"));
    updateTimeMutation.mutate();
  };

  const getStatusDisplay = () => {
    switch (monitoring.status) {
      case 'needs_attention':
      case 'significantly_overdue':
      case 'overdue':
        return {
          icon: AlertTriangle,
          color: 'text-destructive',
          bg: 'bg-destructive/10',
          title: 'VOCÊ AINDA ESTÁ NO MAR?',
          subtitle: `Sua previsão era ${new Date(trip.expected_return_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        };
      case 'return_approaching':
        return {
          icon: Clock,
          color: 'text-orange-500',
          bg: 'bg-orange-50',
          title: 'RETORNO PRÓXIMO',
          subtitle: `Previsão de retorno: ${new Date(trip.expected_return_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        };
      default:
        return {
          icon: Anchor,
          color: 'text-primary',
          bg: 'bg-primary/5',
          title: 'SUA SAÍDA ESTÁ ATIVA',
          subtitle: `Retorno previsto: ${new Date(trip.expected_return_at || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        };
    }
  };

  const display = getStatusDisplay();

  return (
    <div className="space-y-4">
      <Card className={`border-none rounded-[2rem] overflow-hidden shadow-lg ${display.bg}`}>
        <CardContent className="p-6 text-center space-y-4">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${display.color} bg-white shadow-sm`}>
            <display.icon size={32} />
          </div>
          
          <div className="space-y-1">
            <h3 className={`text-xl font-black uppercase tracking-tight ${display.color}`}>
              {display.title}
            </h3>
            <p className="text-muted-foreground font-medium">
              {display.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            {(monitoring.status.includes('overdue')) && (
              <Button 
                onClick={() => confirmMutation.mutate()}
                disabled={confirmMutation.isPending}
                className="rounded-2xl h-14 font-black uppercase tracking-widest text-lg bg-primary hover:bg-primary/90"
              >
                <CheckCircle2 className="mr-2" />
                AINDA ESTOU NO MAR
              </Button>
            )}

            {monitoring.status === 'return_approaching' && (
              <Button 
                onClick={() => setIsTimeDialogOpen(true)}
                variant="outline"
                className="rounded-2xl h-14 font-black uppercase tracking-widest border-2"
              >
                ALTERAR PREVISÃO
              </Button>
            )}

            <Button 
              onClick={onTripEnd}
              variant={monitoring.status.includes('overdue') ? 'secondary' : 'default'}
              className="rounded-2xl h-14 font-black uppercase tracking-widest"
            >
              <Navigation className="mr-2 rotate-45" />
              JÁ RETORNEI
            </Button>
          </div>
        </CardContent>
      </Card>

      <Button 
        onClick={() => setIsTimeDialogOpen(true)}
        variant="ghost" 
        className="w-full text-muted-foreground font-bold py-4"
      >
        ALTERAR HORÁRIO DE RETORNO
      </Button>

      <Dialog open={isTimeDialogOpen} onOpenChange={setIsTimeDialogOpen}>
        <DialogContent className="rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight text-center">
              Alterar Retorno
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Novo Horário</label>
              <Input 
                type="time" 
                value={newTime} 
                onChange={(e) => setNewTime(e.target.value)}
                className="rounded-2xl h-14 text-xl font-bold border-2 focus:border-primary"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-1">Motivo (Opcional)</label>
              <Input 
                placeholder="Ex: Peixe batendo, maré boa..." 
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-2xl h-14 font-medium border-2 focus:border-primary"
              />
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button 
              onClick={handleUpdateTime}
              disabled={!newTime || updateTimeMutation.isPending}
              className="w-full rounded-2xl h-14 font-black uppercase tracking-widest text-lg"
            >
              CONFIRMAR ALTERAÇÃO
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
