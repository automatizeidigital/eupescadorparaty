import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SOSButtonProps {
  onTrigger: () => void;
  className?: string;
  size?: 'default' | 'lg' | 'xl';
}

export function SOSButton({ onTrigger, className, size = 'default' }: SOSButtonProps) {
  const [isPressing, setIsPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const startPress = () => {
    setIsPressing(true);
    setProgress(0);
    startTimeRef.current = Date.now();
    
    const duration = 3000; // 3 segundos
    
    const updateProgress = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress < 100) {
        timerRef.current = requestAnimationFrame(updateProgress);
      } else {
        setIsPressing(false);
        onTrigger();
      }
    };
    
    timerRef.current = requestAnimationFrame(updateProgress);
  };

  const cancelPress = () => {
    setIsPressing(false);
    setProgress(0);
    if (timerRef.current) {
      cancelAnimationFrame(timerRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) cancelAnimationFrame(timerRef.current);
    };
  }, []);

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      <Button
        variant="destructive"
        className={cn(
          "relative overflow-hidden transition-all active:scale-95 touch-none",
          size === 'xl' ? "h-32 w-32 rounded-full text-2xl font-black" : 
          size === 'lg' ? "h-24 w-24 rounded-full text-xl font-bold" : "h-20 w-20 rounded-full",
          isPressing && "scale-110"
        )}
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
      >
        <div className="z-10 flex flex-col items-center">
          <AlertTriangle size={size === 'xl' ? 48 : 32} className="mb-1" />
          <span>SOS</span>
        </div>
        
        {/* Barra de progresso circular simulada/fundo */}
        {isPressing && (
          <div 
            className="absolute bottom-0 left-0 w-full bg-white/30 transition-all duration-75"
            style={{ height: `${progress}%` }}
          />
        )}
      </Button>
      
      <p className="mt-3 text-sm font-bold text-destructive animate-pulse">
        {isPressing ? "SEGURE POR 3 SEGUNDOS..." : "SEGURE PARA AJUDA"}
      </p>
    </div>
  );
}
