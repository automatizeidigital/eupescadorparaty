import { useState, useEffect } from 'react';
import { RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { setupPwaUpdate } from '@/lib/pwa-update';
import { useQuery } from '@tanstack/react-query';
import { getActiveTrip } from '@/lib/map.functions';

export const PwaUpdateBanner = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  
  // Só verifica se há viagem ativa para evitar interrupções
  const { data: activeTrip } = useQuery({
    queryKey: ['active-trip-widget'],
    queryFn: () => getActiveTrip(),
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    setupPwaUpdate(() => setUpdateAvailable(true));
  }, []);

  // Não mostrar se houver viagem ativa para não forçar reload em momento crítico
  if (!updateAvailable || activeTrip) return null;

  const handleUpdate = () => {
    window.location.reload();
  };

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md shadow-2xl">
      <Alert className="bg-primary text-primary-foreground border-none">
        <RefreshCcw className="h-4 w-4 text-white" />
        <AlertTitle className="ml-2 font-bold text-white">Nova versão disponível</AlertTitle>
        <AlertDescription className="ml-2 text-xs text-white/90 flex items-center justify-between gap-4">
          <span>Atualize agora para ter acesso às melhorias de segurança.</span>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 rounded-full font-bold px-4 shrink-0"
            onClick={handleUpdate}
          >
            ATUALIZAR
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};
