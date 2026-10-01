import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';

export const ConnectivityStatus = () => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowBanner(true);
      // Esconder banner de "voltou" após 3 segundos
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner && isOnline) return null;

  return (
    <div className={cn(
      "fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md transition-all duration-500 transform",
      showBanner ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0"
    )}>
      <Alert variant={isOnline ? "default" : "destructive"} className="shadow-lg border-2">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4" />
        )}
        <AlertTitle className="ml-2 font-bold">
          {isOnline ? "Conexão Restaurada" : "Você está Offline"}
        </AlertTitle>
        <AlertDescription className="ml-2 text-xs opacity-90">
          {isOnline 
            ? "Sincronizando dados pendentes..." 
            : "Algumas informações podem estar desatualizadas. Operações críticas serão salvas e enviadas assim que houver sinal."}
        </AlertDescription>
      </Alert>
    </div>
  );
};
