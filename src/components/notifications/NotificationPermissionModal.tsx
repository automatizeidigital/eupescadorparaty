import React, { useState, useEffect } from 'react';
import { Bell, Shield, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { registerPushToken } from '@/lib/notifications.functions';
import { toast } from 'sonner';

export function NotificationPermissionModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    typeof window !== 'undefined' ? Notification.permission : 'default'
  );

  useEffect(() => {
    // Verificar se já temos permissão ou se o usuário já recusou no sistema
    const checkPermission = async () => {
      if (typeof window === 'undefined' || !('Notification' in window)) return;
      
      const currentPermission = Notification.permission;
      setPermission(currentPermission);

      // Mostrar o modal apenas se estiver em 'default' e o usuário ainda não viu este modal nesta sessão
      const hasSeenModal = sessionStorage.getItem('hasSeenNotifModal');
      if (currentPermission === 'default' && !hasSeenModal) {
        // Delay pequeno para não ser imediato ao carregar
        setTimeout(() => setIsOpen(true), 2000);
      }
    };

    checkPermission();
  }, []);

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      toast.error("Seu navegador não suporta notificações.");
      return;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      setIsOpen(false);
      sessionStorage.setItem('hasSeenNotifModal', 'true');

      if (result === 'granted') {
        toast.success("Notificações ativadas com sucesso!");
        
        // No mundo real, aqui registraríamos o token FCM/Push
        // Simulando registro de token para a infraestrutura
        try {
          await registerPushToken({
            data: {
              token: 'simulated-pwa-token-' + Math.random().toString(36).substring(7),
              provider: 'browser-native',
              platform: navigator.platform,
              deviceName: navigator.userAgent.substring(0, 50)
            }
          });
        } catch (e) {
          console.error("Erro ao registrar token no backend:", e);
        }
      }
    } catch (error) {
      console.error("Erro ao solicitar permissão:", error);
      toast.error("Não foi possível ativar as notificações.");
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('hasSeenNotifModal', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 p-4 animate-in fade-in duration-300">
      <Card className="w-full max-w-[400px] rounded-[2.5rem] border-none shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
        <div className="relative p-8 text-center space-y-6">
          <button 
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-muted/50 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary relative">
              <Bell size={48} />
              <div className="absolute -top-1 -right-1 h-6 w-6 bg-destructive rounded-full border-4 border-white animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">
              Receba avisos importantes
            </h3>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed px-4">
              O <span className="text-primary font-bold">EU PESCADOR!</span> avisa você sobre mau tempo, comunicados da Secretaria e alertas críticos de segurança.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-2">
            <Button 
              onClick={handleRequestPermission}
              className="h-14 rounded-2xl text-lg font-black uppercase tracking-widest shadow-lg shadow-primary/20"
            >
              ATIVAR AVISOS
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleDismiss}
              className="h-12 rounded-2xl text-sm font-bold uppercase tracking-widest text-muted-foreground"
            >
              AGORA NÃO
            </Button>
          </div>

          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
            <Shield size={12} /> Segurança em primeiro lugar
          </div>
        </div>
      </Card>
    </div>
  );
}
