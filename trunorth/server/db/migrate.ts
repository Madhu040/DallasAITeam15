import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import { dirname } from "path";
import { serverConfig } from "../config.js";

const DB_PATH = serverConfig.databasePath;

mkdirSync(dirname(DB_PATH), { recursive: true });

export const db = new Database(DB_PATH);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// Parent auth, child profiles, progress, and audit logs moved to Supabase Postgres
// (ADR-003 — see supabase/migrations/0001_children_progress.sql). This SQLite file
// now only backs Play Together's `together_rooms` table (created lazily in
// server/routes/together.ts), which is intentionally out of scope for that migration.

console.log(`Database ready at ${DB_PATH}`);
