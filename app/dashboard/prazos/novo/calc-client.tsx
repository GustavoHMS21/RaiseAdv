'use client';
import { useState, useMemo } from 'react';
import { addBusinessDays, addCalendarDays, type Preset } from '@/lib/deadlines';

export default function DeadlineCalcClient({ presets }: { presets: Preset[] }) {
  const [preset, setPreset] = useState('contestacao');
  const [sourceDate, setSourceDate] = useState('');
  const [days, setDays] = useState(15);
  const [businessDaysOnly, setBusinessDaysOnly] = useState(true);

  function onPresetChange(key: string) {
    setPreset(key);
    const p = presets.find((x) => x.key === key);
    if (p && p.days > 0) {
      setDays(p.days);
      setBusinessDaysOnly(p.businessDays);
    }
  }

  const computed = useMemo(() => {
    if (!sourceDate || days <= 0) return null;
    const [y, m, d] = sourceDate.split('-').map(Number);
    if (!y || !m || !d) return null;
    const base = new Date(y, m - 1, d, 12, 0, 0);
    return businessDaysOnly ? addBusinessDays(base, days) : addCalendarDays(base, days);
  }, [sourceDate, days, businessDaysOnly]);

  return (
    <div className="space-y-4 rounded-lg border border-brand/20 bg-brand/5 p-4">
      <div>
        <label className="text-sm font-medium">Tipo de prazo</label>
        <select
          name="deadline_type"
          value={preset}
          onChange={(e) => onPresetChange(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
        >
          {presets.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
              {p.days > 0 ? ` (${p.days} dias${p.businessDays ? ' úteis' : ' corridos'})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Data da intimação *</label>
          <input
            name="source_date"
            type="date"
            value={sourceDate}
            onChange={(e) => setSourceDate(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Dias</label>
          <input
            name="days"
            type="number"
            min={0}
            max={365}
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={businessDaysOnly}
          onChange={(e) => setBusinessDaysOnly(e.target.checked)}
        />
        Contar apenas dias úteis (CPC art. 219)
        {/* campo real enviado — checkbox HTML só envia quando marcado */}
        <input type="hidden" name="business_days_only" value={businessDaysOnly ? 'on' : ''} />
      </label>

      {computed && (
        <div className="rounded-md border border-brand/30 bg-white p-3">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Data-limite calculada
          </p>
          <p className="mt-1 text-lg font-bold text-brand">
            {computed.toLocaleDateString('pt-BR', {
              weekday: 'long',
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Recálculo de segurança feito no servidor ao salvar.
          </p>
        </div>
      )}

      <input type="hidden" name="starts_at" value={computed ? computed.toISOString() : ''} />
    </div>
  );
}
