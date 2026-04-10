/**
 * Validação de variáveis de ambiente no startup.
 * Importado pelo layout.tsx — falha rápido se faltam keys obrigatórias.
 * NUNCA expor service_role ou secrets ao client-side.
 */

function required(name: string): string {
  const value = process.env[name];
  if (!value || value === 'placeholder') {
    throw new Error(
      `[ENV] Variável ${name} não configurada. Veja .env.example para referência.`
    );
  }
  return value;
}

/** Variáveis públicas — expostas ao browser via NEXT_PUBLIC_ prefix */
export const env = {
  SUPABASE_URL: required('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_ANON_KEY: required('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;

/** Variáveis server-only — NUNCA importar em componentes 'use client' */
export const serverEnv = {
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  DATAJUD_API_KEY: process.env.DATAJUD_API_KEY || '',
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
} as const;

/**
 * Guard: impede importação de serverEnv no client-side.
 * Next.js já faz isso para non-NEXT_PUBLIC_ vars, mas este é um safety net explícito.
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
  // No client-side, serverEnv não deve ter valores reais
  Object.keys(serverEnv).forEach((key) => {
    if ((serverEnv as any)[key]) {
      console.error(`[SECURITY] Server-only env var ${key} vazou para o client!`);
    }
  });
}
