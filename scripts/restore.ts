/**
 * Script de restore do banco RaiseAdv a partir de backup JSON.
 *
 * USO COM EXTREMO CUIDADO — sobrescreve dados existentes.
 *
 * Uso:
 *   npx tsx scripts/restore.ts ./backups/2026-04-11
 *
 * Variáveis necessárias:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *   RESTORE_CONFIRM=YES_I_UNDERSTAND
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createInterface } from 'node:readline/promises';

const TABLES_ORDER = [
  // ordem de inserção respeitando FKs
  'organizations',
  'members',
  'clients',
  'cases',
  'case_movements',
  'events',
  'finance_entries',
  'consent_records',
  'processing_activities',
  'data_subject_requests',
  'lgpd_consents',
] as const;

async function confirm(question: string): Promise<boolean> {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(question);
  rl.close();
  return answer.trim().toLowerCase() === 'yes';
}

async function main() {
  const backupDir = process.argv[2];
  if (!backupDir) {
    console.error('Uso: npx tsx scripts/restore.ts <backup-dir>');
    process.exit(1);
  }

  if (!existsSync(backupDir)) {
    console.error(`Diretório não existe: ${backupDir}`);
    process.exit(1);
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Faltam credenciais Supabase');
    process.exit(1);
  }

  if (process.env.RESTORE_CONFIRM !== 'YES_I_UNDERSTAND') {
    console.error('');
    console.error('  ⚠️  ATENÇÃO: este script SOBRESCREVE dados em produção.');
    console.error('  ⚠️  Para confirmar, defina: RESTORE_CONFIRM=YES_I_UNDERSTAND');
    console.error('');
    process.exit(1);
  }

  // Validar manifest e hashes
  const manifestPath = join(backupDir, 'manifest.json');
  if (!existsSync(manifestPath)) {
    console.error(`Manifest não encontrado: ${manifestPath}`);
    process.exit(1);
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
  console.log(`[restore] Backup: ${manifest.backup_date}`);
  console.log(`[restore] Total: ${manifest.total_rows} linhas em ${manifest.tables.length} tabelas`);

  // Verificar integridade
  console.log('[restore] Verificando integridade SHA-256...');
  for (const entry of manifest.tables) {
    const filePath = join(backupDir, `${entry.table}.json`);
    if (!existsSync(filePath)) {
      console.error(`[restore] FALTA: ${filePath}`);
      process.exit(1);
    }
    const content = readFileSync(filePath, 'utf-8');
    const hash = createHash('sha256').update(content).digest('hex');
    if (hash !== entry.sha256) {
      console.error(`[restore] HASH INVÁLIDO: ${entry.table}`);
      console.error(`  esperado: ${entry.sha256}`);
      console.error(`  obtido:   ${hash}`);
      process.exit(1);
    }
  }
  console.log('[restore] Integridade OK');

  const ok = await confirm('Digite "yes" para confirmar o restore: ');
  if (!ok) {
    console.log('[restore] Cancelado.');
    process.exit(0);
  }

  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'jusflow' },
  });

  for (const table of TABLES_ORDER) {
    const filePath = join(backupDir, `${table}.json`);
    if (!existsSync(filePath)) {
      console.log(`[restore] PULAR: ${table} (não no backup)`);
      continue;
    }
    const rows = JSON.parse(readFileSync(filePath, 'utf-8'));
    if (!Array.isArray(rows) || rows.length === 0) {
      console.log(`[restore] ${table}: vazio`);
      continue;
    }

    process.stdout.write(`[restore] ${table}: inserindo ${rows.length} linhas... `);

    // Insert em batches de 500
    const BATCH = 500;
    for (let i = 0; i < rows.length; i += BATCH) {
      const slice = rows.slice(i, i + BATCH);
      const { error } = await client.from(table).upsert(slice);
      if (error) {
        console.error(`ERRO no batch ${i}: ${error.message}`);
        process.exit(1);
      }
    }
    console.log('OK');
  }

  console.log('[restore] CONCLUÍDO. Validar smoke tests no app antes de liberar usuários.');
}

main().catch((err) => {
  console.error('[restore] Falha:', err);
  process.exit(1);
});
