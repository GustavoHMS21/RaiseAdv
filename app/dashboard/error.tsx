'use client';

import { Button } from '@/components/ui';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h2 className="text-lg font-semibold text-slate-900">Algo deu errado</h2>
      <p className="mt-2 text-sm text-slate-600">
        Ocorreu um erro inesperado. Tente novamente.
      </p>
      {error.digest && (
        <p className="mt-1 font-mono text-xs text-slate-400">Ref: {error.digest}</p>
      )}
      <Button onClick={reset} variant="secondary" className="mt-4">
        Tentar novamente
      </Button>
    </div>
  );
}
