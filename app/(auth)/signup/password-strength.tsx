'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

const LABELS = ['Muito fraca', 'Fraca', 'Razoável', 'Forte', 'Muito forte'] as const;
const COLORS = ['bg-rose-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-emerald-600'];
const TEXT_COLORS = ['text-rose-600', 'text-orange-600', 'text-amber-600', 'text-emerald-600', 'text-emerald-700'];

function computeScore(pw: string): { score: 0 | 1 | 2 | 3 | 4; errors: string[] } {
  const errors: string[] = [];
  if (pw.length < 12) errors.push('Mínimo 12 caracteres');
  if (!/[a-z]/.test(pw)) errors.push('Inclua letra minúscula');
  if (!/[A-Z]/.test(pw)) errors.push('Inclua letra maiúscula');
  if (!/[0-9]/.test(pw)) errors.push('Inclua um número');
  if (/(.)\1{3,}/.test(pw)) errors.push('Evite caracteres repetidos');

  let score: 0 | 1 | 2 | 3 | 4 = 0;
  if (errors.length === 0) {
    score = 2;
    if (pw.length >= 14) score = 3;
    if (pw.length >= 16 && /[^a-zA-Z0-9]/.test(pw)) score = 4;
  } else if (pw.length >= 8) {
    score = 1;
  }
  return { score, errors };
}

export function PasswordInput() {
  const [pw, setPw] = useState('');
  const { score, errors } = pw.length > 0 ? computeScore(pw) : { score: 0 as const, errors: [] };
  const show = pw.length > 0;

  return (
    <div>
      <label className="text-sm font-medium text-slate-700">Senha</label>
      <input
        name="password"
        type="password"
        required
        minLength={12}
        autoComplete="new-password"
        value={pw}
        onChange={(e) => setPw(e.target.value)}
        className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
      />
      {show && (
        <div className="mt-2 space-y-1.5">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors',
                  i < score ? COLORS[score] : 'bg-slate-200',
                )}
              />
            ))}
          </div>
          <p className={cn('text-xs font-medium', TEXT_COLORS[score])}>
            {LABELS[score]}
          </p>
          {errors.length > 0 && (
            <ul className="space-y-0.5">
              {errors.map((e) => (
                <li key={e} className="text-xs text-slate-500">• {e}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
