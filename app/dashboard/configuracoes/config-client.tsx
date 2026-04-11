'use client';

import { useState, useTransition } from 'react';
import { Button, Select, Textarea } from '@/components/ui';

const REQUEST_TYPES = [
  { value: 'access', label: 'Acesso aos meus dados' },
  { value: 'correction', label: 'Correção de dados' },
  { value: 'anonymization', label: 'Anonimização' },
  { value: 'deletion', label: 'Eliminação de dados' },
  { value: 'portability', label: 'Portabilidade' },
  { value: 'revoke_consent', label: 'Revogar consentimento' },
  { value: 'info_sharing', label: 'Informação sobre compartilhamento' },
];

export function ConfigClient() {
  const [requestType, setRequestType] = useState('access');
  const [details, setDetails] = useState('');
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  function submitRequest() {
    startTransition(async () => {
      try {
        const res = await fetch('/api/lgpd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ request_type: requestType, details }),
        });
        if (res.ok) {
          setMessage({ type: 'success', text: 'Solicitação registrada. Resposta em até 15 dias.' });
          setDetails('');
        } else {
          const err = await res.json();
          setMessage({ type: 'error', text: err.error || 'Erro ao registrar solicitação' });
        }
      } catch {
        setMessage({ type: 'error', text: 'Erro de conexão' });
      }
    });
  }

  return (
    <div className="mt-3 space-y-3">
      <Select
        label="Tipo de solicitação"
        value={requestType}
        onChange={(e) => setRequestType(e.target.value)}
      >
        {REQUEST_TYPES.map((t) => (
          <option key={t.value} value={t.value}>{t.label}</option>
        ))}
      </Select>
      <Textarea
        label="Detalhes (opcional)"
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        rows={3}
        placeholder="Descreva sua solicitação se desejar"
      />
      <Button onClick={submitRequest} disabled={isPending}>
        {isPending ? 'Enviando...' : 'Enviar solicitação'}
      </Button>
      {message && (
        <p className={`text-xs ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
