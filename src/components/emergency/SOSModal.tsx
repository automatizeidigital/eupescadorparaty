import React, { useState, useRef } from 'react';
import { savePendingSOS } from '@/lib/pending-sos';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SOSButton } from "./SOSButton";
import { 
  AlertTriangle, 
  CheckCircle2, 
  WifiOff, 
  ShieldAlert,
  Ship,
  MapPin,
  Users,
  Clock,
  Loader2
} from "lucide-react";
import { incidentTypeLabels, IncidentType } from "@/lib/emergency.types";
import { Textarea } from "@/components/ui/textarea";
import { createEmergencyIncident, emergencyInputSchema } from "@/lib/emergency.functions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface SOSModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTrip?: any;
  currentPosition?: any;
  profile?: any;
}

export function SOSModal({ isOpen, onClose, activeTrip, currentPosition, profile }: SOSModalProps) {
  const [step, setStep] = useState<'trigger' | 'type' | 'confirm' | 'success'>('trigger');
  const [incidentType, setIncidentType] = useState<IncidentType | null>(null);
  const [message, setMessage] = useState('');
  const requestId = useRef<string | null>(null);
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' && !navigator.onLine);

  const mutation = useMutation({
    mutationFn: createEmergencyIncident,
    onSuccess: (data) => {
      setStep('success');
      toast.success("Pedido de ajuda registrado com sucesso!");
    },
    onError: async (error, variables) => {
      console.error("Erro ao enviar SOS:", error);
      if (!navigator.onLine) {
        setIsOffline(true);
        try {
          if (!variables?.data) throw new Error('Pedido ausente');
          await savePendingSOS(emergencyInputSchema.parse(variables.data));
          window.dispatchEvent(new Event('pending-sos-changed'));
          toast.warning('Pedido salvo neste aparelho, aguardando envio. Ainda não foi recebido. Em emergência, ligue 185 ou 193.');
        } catch {
          toast.error('Não foi possível salvar nem enviar o pedido. Em emergência, ligue 185 ou 193.');
        }
      } else {
        toast.error("Erro ao registrar pedido de ajuda. Tente novamente.");
      }
    }
  });

  const handleSOSTriggered = () => {
    setStep('type');
  };

  const handleConfirm = () => {
    requestId.current ??= crypto.randomUUID();
    
    mutation.mutate({
      data: {
        trip_id: activeTrip?.id || null,
        boat_id: activeTrip?.boat_id || profile?.primary_boat_id || null,
        incident_type: incidentType,
        message: message || null,
        latitude: currentPosition?.lat ?? null,
        longitude: currentPosition?.lng ?? null,
        accuracy: currentPosition?.accuracy || null,
        location_recorded_at: currentPosition?.timestamp || new Date().toISOString(),
        location_source: currentPosition ? 'current' : (activeTrip ? 'trip_last_known' : 'none'),
        client_request_id: requestId.current,
        contact_phone: profile?.phone || null,
        emergency_contact_name: profile?.emergency_contact_name || null,
        emergency_contact_phone: profile?.emergency_contact_phone || null
      }
    });
  };

  const reset = () => {
    requestId.current = null;
    setStep('trigger');
    setIncidentType(null);
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && reset()}>
      <DialogContent className="rounded-[2rem] w-[95%] max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
        <div className={cn(
          "p-6 text-white",
          step === 'success' ? "bg-green-600" : "bg-destructive"
        )}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2 text-white">
              {step === 'success' ? <CheckCircle2 size={32} /> : <ShieldAlert size={32} />}
              {step === 'success' ? "Pedido Registrado" : "Emergência SOS"}
            </DialogTitle>
            <DialogDescription className="text-white/90 font-medium">
              {step === 'success' 
                ? "Sua solicitação de ajuda está no sistema."
                : "Use este recurso somente se precisar de ajuda real."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto bg-background">
          {step === 'trigger' && (
            <div className="py-8 flex flex-col items-center justify-center space-y-6">
              <SOSButton size="xl" onTrigger={handleSOSTriggered} />
              <div className="bg-destructive/10 p-4 rounded-2xl border border-destructive/20 text-destructive text-center">
                <p className="font-bold text-sm">ATENÇÃO:</p>
                <p className="text-xs">O aplicativo NÃO substitui os canais oficiais (190, 193, 185).</p>
              </div>
            </div>
          )}

          {step === 'type' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">O que aconteceu?</h3>
              <div className="grid grid-cols-2 gap-3">
                {(Object.entries(incidentTypeLabels) as [IncidentType, string][]).map(([type, label]) => (
                  <Button
                    key={type}
                    variant={incidentType === type ? "destructive" : "outline"}
                    className={cn(
                      "h-auto py-4 px-2 text-xs font-bold text-center flex flex-col gap-2 rounded-xl whitespace-normal break-words",
                      incidentType === type && "border-2 border-white/50"
                    )}
                    onClick={() => setIncidentType(type)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold">Detalhes adicionais (opcional)</label>
                <Textarea 
                  placeholder="Ex: Motor parou e estamos à deriva."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="rounded-xl border-2"
                  maxLength={200}
                />
              </div>

              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold bg-destructive hover:bg-destructive/90"
                onClick={() => setStep('confirm')}
              >
                PROSSEGUIR
              </Button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Resumo da Emergência</h3>
              
              <div className="space-y-4 bg-muted/50 p-4 rounded-2xl border-2">
                <div className="flex items-start gap-3">
                  <Ship className="text-muted-foreground shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Embarcação</p>
                    <p className="font-bold">{activeTrip?.boat_name || "Não identificada"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="text-muted-foreground shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Localização</p>
                    <p className="font-bold">
                      {currentPosition 
                        ? `Atual (Precisão: ${currentPosition.accuracy?.toFixed(0)}m)` 
                        : (activeTrip ? "Última conhecida da viagem" : "Não disponível")}
                    </p>
                    {currentPosition?.timestamp && (
                      <p className="text-[10px] text-muted-foreground">
                        Registrada às {new Date(currentPosition.timestamp).toLocaleTimeString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-destructive shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Tipo de Incidente</p>
                    <p className="font-bold">{incidentType ? incidentTypeLabels[incidentType] : "Não especificado"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200 text-orange-800 text-sm">
                <p className="font-bold mb-1">Confirmação do Registro:</p>
                <p>Seu pedido será registrado no sistema Eu Pescador. Em caso de perigo iminente, contate a Marinha (185).</p>
              </div>

              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full h-14 rounded-2xl text-lg font-black bg-destructive hover:bg-destructive/90"
                  onClick={handleConfirm}
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                  CONFIRMAR SOS
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full h-12 rounded-2xl font-bold"
                  onClick={() => setStep('type')}
                >
                  VOLTAR
                </Button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="py-6 text-center space-y-6">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle2 size={48} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-green-700">PEDIDO REGISTRADO</h3>
                <p className="font-bold text-muted-foreground">
                  Protocolo: <span className="text-foreground">{mutation.data?.sos_number}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Registrado às {new Date(mutation.data?.created_at || "").toLocaleTimeString()}
                </p>
              </div>

              <div className="bg-green-50 p-6 rounded-[2rem] border-2 border-green-200 space-y-4">
                <p className="text-green-800 font-medium leading-relaxed">
                  Seu pedido foi registrado no sistema. Isso não confirma que uma equipe recebeu ou iniciou atendimento. Em perigo imediato, use os canais oficiais.
                </p>
                <div className="pt-4 border-t border-green-200 flex flex-col gap-2">
                  <p className="text-xs font-bold text-green-700 uppercase">Canais de Emergência Oficiais:</p>
                  <div className="flex justify-center gap-4">
                    <div className="text-center">
                      <p className="font-black text-lg">185</p>
                      <p className="text-[10px] uppercase font-bold">Marinha</p>
                    </div>
                    <div className="text-center">
                      <p className="font-black text-lg">193</p>
                      <p className="text-[10px] uppercase font-bold">Bombeiros</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-14 rounded-2xl text-lg font-bold bg-green-600 hover:bg-green-700"
                onClick={reset}
              >
                ENTENDIDO
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
