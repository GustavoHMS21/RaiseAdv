/** Tipos derivados do schema jusflow — manter sincronizado com ALL_IN_ONE.sql */

export type OrgPlan = 'free' | 'pro' | 'team';
export type MemberRole = 'owner' | 'admin' | 'lawyer' | 'assistant';
export type ClientType = 'pf' | 'pj';
export type CaseStatus = 'active' | 'archived' | 'won' | 'lost' | 'settled';
export type EventKind = 'deadline' | 'hearing' | 'meeting' | 'task';
export type EventPriority = 'low' | 'normal' | 'high' | 'critical';
export type FinanceKind = 'income' | 'expense';

export interface Organization {
  id: string;
  name: string;
  plan: OrgPlan;
  created_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  organization_id: string;
  role: MemberRole;
  created_at: string;
  organizations?: Organization;
}

export interface Client {
  id: string;
  organization_id: string;
  type: ClientType;
  name: string;
  document: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Case {
  id: string;
  organization_id: string;
  client_id: string | null;
  cnj_number: string | null;
  title: string;
  court: string | null;
  area: string | null;
  status: CaseStatus;
  opposing_party: string | null;
  value_cents: number;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  clients?: Client;
}

export interface CaseMovement {
  id: string;
  organization_id: string;
  case_id: string;
  occurred_at: string;
  description: string;
  source: string;
  created_by: string | null;
  created_at: string;
}

export interface Event {
  id: string;
  organization_id: string;
  case_id: string | null;
  title: string;
  kind: EventKind;
  starts_at: string;
  ends_at: string | null;
  done: boolean;
  notes: string | null;
  priority: EventPriority;
  is_legal_deadline: boolean;
  deadline_type: string | null;
  business_days_only: boolean;
  source_date: string | null;
  fulfilled_at: string | null;
  fulfilled_by: string | null;
  reminder_days: number[];
  created_by: string | null;
  created_at: string;
  cases?: Pick<Case, 'title' | 'cnj_number'>;
}

export interface FinanceEntry {
  id: string;
  organization_id: string;
  case_id: string | null;
  client_id: string | null;
  kind: FinanceKind;
  amount_cents: number;
  description: string;
  due_date: string | null;
  paid_at: string | null;
  created_by: string | null;
  created_at: string;
  cases?: Pick<Case, 'title'>;
  clients?: Pick<Client, 'name'>;
}
