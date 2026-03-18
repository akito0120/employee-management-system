import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'
import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import * as schema from './schema'

const dbPath = app.isPackaged ? path.join(app.getPath('userData'), 'database.db') : 'local.db'

const sqlite = new Database(dbPath)
export const db = drizzle(sqlite, { schema, logger: true })
export type DatabaseType = typeof db

const migrationsPath = app.isPackaged
  ? path.join(process.resourcesPath, 'drizzle')
  : path.join(__dirname, '../../drizzle')

export const migrateDB = (): void => {
  migrate(db, { migrationsFolder: migrationsPath })
}
