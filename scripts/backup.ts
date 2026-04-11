/**
 * Script de backup do banco RaiseAdv.
 *
 * Conecta no Supabase com SERVICE_ROLE_KEY, exporta todas as tabelas
 * do schema `jusflow` para JSON e gera um manifest com hash SHA-256.
 *
 * Uso:
 *   npx tsx scripts/backup.ts
 *
 * Variáveis necessárias:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Output:
 *   backups/YYYY-MM-DD/
 *     manifest.json
 *     organizations.json
 *     members.json
 *     clients.json
 *     cases.json
 *     case_movements.json
 *     events.json
 *     finance_entries.json
 *     consent_records.json
 *     processing_activities.json
 *     data_subject_requests.json
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';

const TABLES = [
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
  // 'access_logs', // PROIBIDO exportar — sigilo Marco Civil. Backup separado e cifrado.
] as const;

interface ManifestEntry {
  table: string;
  count: number;
  bytes: number;
  sha256: string;
  exported_at: string;
}

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('[backup] Faltam NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
    db: { schema: 'jusflow' },
  });

  const date = new Date().toISOString().slice(0, 10);
  const dir = join(process.cwd(), 'backups', date);
  mkdirSync(dir, { recursive: true });

  console.log(`[backup] Iniciando backup em ${dir}`);

  const manifest: ManifestEntry[] = [];

  for (const table of TABLES) {
    process.stdout.write(`[backup] ${table}... `);

    const { data, error } = await client.from(table).select('*');

    if (error) {
      console.error(`ERRO: ${error.message}`);
      // Continua com as outras tabelas
      continue;
    }

    const json = JSON.stringify(data ?? [], null, 2);
    const filePath = join(dir, `${table}.json`);
    writeFileSync(filePath, json, 'utf-8');

    const hash = createHash('sha256').update(json).digest('hex');

    manifest.push({
      table,
      count: data?.length ?? 0,
      bytes: Buffer.byteLength(json, 'utf-8'),
      sha256: hash,
      exported_at: new Date().toISOString(),
    });

    console.log(`${data?.length ?? 0} linhas`);
  }

  const manifestPath = join(dir, 'manifest.json');
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        backup_date: date,
        schema: 'jusflow',
        tables: manifest,
        total_rows: manifest.reduce((sum, m) => sum + m.count, 0),
        total_bytes: manifest.reduce((sum, m) => sum + m.bytes, 0),
        generator: 'scripts/backup.ts',
        version: '1.0',
      },
      null,
      2,
    ),
    'utf-8',
  );

  console.log(`[backup] OK. Manifest: ${manifestPath}`);
  console.log(`[backup] Total: ${manifest.reduce((s, m) => s + m.count, 0)} linhas em ${manifest.length} tabelas`);
  console.log(`[backup] Lembre-se de armazenar em pelo menos 3 locais distintos (regra 3-2-1).`);
}

main().catch((err) => {
  console.error('[backup] Falha:', err);
  process.exit(1);
});
