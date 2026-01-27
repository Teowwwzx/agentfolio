import { config as loadEnv } from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import postgres from 'postgres'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const envLocalPath = path.join(rootDir, '.env.local')
if (fs.existsSync(envLocalPath)) loadEnv({ path: envLocalPath })

const envPath = path.join(rootDir, '.env')
if (fs.existsSync(envPath)) loadEnv({ path: envPath })

export function getDatabaseUrl() {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('Missing DATABASE_URL in .env.local (or .env)')
  return url
}

export function getDb() {
  const url = getDatabaseUrl()
  return postgres(url, { max: 1 })
}

