import { createFileRoute, Link } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import logoAsset from '@/assets/logo.asset.json';
export const Route = createFileRoute('/entrar')({ component: AccessPaused });
function AccessPaused() { return <div className="min-h-screen bg-background flex items-center justify-center p-6"><Card className="w-full max-w-[400px] border-2 shadow-xl rounded-3xl"><CardHeader className="text-center"><img src={logoAsset.url} alt="EU PESCADOR!" className="w-24 mx-auto mb-4"/><CardTitle>Acesso em preparação</CardTitle><CardDescription>Estamos reconstruindo os serviços do Eu Pescador!.</CardDescription></CardHeader><CardContent className="space-y-4 text-center"><p>Login e novos cadastros estão temporariamente indisponíveis. Aguarde a liberação da nova versão.</p><Link to="/" className="text-primary font-bold underline">Voltar ao início</Link></CardContent></Card></div>; }
