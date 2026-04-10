import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBRL(cents: number) {
  return (cents / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Extrai string de FormData, retornando null para vazio. Evita duplicação nos server actions. */
export function formStr(v: FormDataEntryValue | null): string | null {
  if (v === null) return null;
  const str = typeof v === 'string' ? v.trim() : '';
  return str === '' ? null : str;
}
