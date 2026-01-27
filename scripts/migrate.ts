import fs from 'node:fs/promises'
import path from 'node:path'

import { getDb } from './db'

type MigrationRow = {
  filename: string
}

async function ensureMigrationsTable(sql: ReturnType<typeof getDb>) {
  await sql`
    create table if not exists public.schema_migrations (
      filename text primary key,
      applied_at timestamptz not null default now()
    )
  `
}

async function getAppliedMigrations(sql: ReturnType<typeof getDb>) {
  const rows = await sql<MigrationRow[]>`select filename from public.schema_migrations order by filename`
  return new Set(rows.map((r) => r.filename))
}

async function main() {
  const sql = getDb()
  const migrationsDir = path.resolve(process.cwd(), 'db', 'migrations')

  try {
    await ensureMigrationsTable(sql)

    const files = (await fs.readdir(migrationsDir))
      .filter((f) => f.endsWith('.sql'))
      .sort((a, b) => a.localeCompare(b))

    const applied = await getAppliedMigrations(sql)
    const pending = files.filter((f) => !applied.has(f))

    for (const filename of pending) {
      const fullPath = path.join(migrationsDir, filename)
      const contents = await fs.readFile(fullPath, 'utf8')

      await sql.begin(async (tx) => {
        await tx.unsafe(contents)
        await tx.unsafe('insert into public.schema_migrations (filename) values ($1)', [filename])
      })
    }

    const finalApplied = await getAppliedMigrations(sql)
    process.stdout.write(`Applied migrations: ${finalApplied.size}\n`)
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((err) => {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
})
