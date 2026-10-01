import React, { useEffect, useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { checkIsAdmin } from '@/lib/auth-roles.functions';


export function AdminGuard({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const [isAuthChecking, setIsAuthChecking] = useState(false);

  const { data: isAdmin, isLoading: isRoleLoading, error } = useQuery({
    queryKey: ['is-admin'],
    queryFn: () => checkIsAdmin(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isAuthChecking || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Verificando credenciais...</p>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-24 h-24 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">ACESSO NÃO AUTORIZADO</h1>
          <p className="text-slate-600 font-medium">Você não possui permissão para acessar esta área.</p>
          <button 
            onClick={() => navigate({ to: '/app' })}
            className="w-full py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95"
          >
            VOLTAR PARA O INÍCIO
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
