import { z } from 'zod';
import { isValidCNJ, cnjDigits } from './cnj';

// Helper: trata string vazia como null
const emptyToNull = z
  .string()
  .transform((v) => (v.trim() === '' ? null : v.trim()))
  .nullable();

const optionalEmail = z
  .string()
  .transform((v) => v.trim())
  .refine((v) => v === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email inválido')
  .transform((v) => (v === '' ? null : v))
  .nullable();

export const signupSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(12, 'Senha precisa ter ao menos 12 caracteres'),
  orgName: z.string().min(2, 'Nome do escritório obrigatório').max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const clientSchema = z.object({
  type: z.enum(['pf', 'pj']),
  name: z.string().min(2).max(200),
  document: emptyToNull.pipe(z.string().max(20).nullable()),
  email: optionalEmail,
  phone: emptyToNull.pipe(z.string().max(30).nullable()),
  address: emptyToNull.pipe(z.string().max(500).nullable()),
  notes: emptyToNull.pipe(z.string().max(2000).nullable()),
});
export type ClientInput = z.infer<typeof clientSchema>;

export const caseSchema = z.object({
  title: z.string().min(2).max(300),
  cnj_number: emptyToNull.pipe(
    z.string().nullable().refine(
      (v) => v === null || cnjDigits(v).length === 0 || isValidCNJ(v),
      { message: 'Número CNJ inválido (dígito verificador não confere)' }
    )
  ),
  client_id: z.string().uuid().nullable().or(z.literal('').transform(() => null)),
  court: emptyToNull.pipe(z.string().max(200).nullable()),
  area: emptyToNull.pipe(z.string().max(100).nullable()),
  status: z.enum(['active', 'archived', 'won', 'lost', 'settled']).default('active'),
  opposing_party: emptyToNull.pipe(z.string().max(300).nullable()),
  value_cents: z.coerce.number().int().min(0).default(0),
  notes: emptyToNull.pipe(z.string().max(5000).nullable()),
});
export type CaseInput = z.infer<typeof caseSchema>;

export const deadlineSchema = z.object({
  title: z.string().min(2).max(300),
  kind: z.enum(['deadline', 'hearing', 'meeting', 'task']).default('deadline'),
  case_id: z.string().uuid().nullable().or(z.literal('').transform(() => null)),
  deadline_type: emptyToNull.pipe(z.string().max(100).nullable()),
  source_date: emptyToNull.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()),
  days: z.coerce.number().int().min(0).max(365).optional(),
  business_days_only: z.coerce.boolean().default(true),
  starts_at: z.string().datetime({ message: 'Data inválida' }),
  priority: z.enum(['low', 'normal', 'high', 'critical']).default('high'),
  is_legal_deadline: z.coerce.boolean().default(true),
  notes: emptyToNull.pipe(z.string().max(2000).nullable()),
});
export type DeadlineInput = z.infer<typeof deadlineSchema>;

export const financeSchema = z.object({
  kind: z.enum(['income', 'expense']),
  description: z.string().min(2).max(300),
  amount_reais: z.coerce.number().min(0.01),
  due_date: emptyToNull.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()),
  paid_at: emptyToNull.pipe(z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable()),
  case_id: z.string().uuid().nullable().or(z.literal('').transform(() => null)),
  client_id: z.string().uuid().nullable().or(z.literal('').transform(() => null)),
});
export type FinanceInput = z.infer<typeof financeSchema>;
