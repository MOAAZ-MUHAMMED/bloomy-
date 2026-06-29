import pg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '../shared/schema';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  // We throw only if we attempt to use DatabaseStorage; FileStorage acts as a persistent fallback
  console.warn("DATABASE_URL is not set. DatabaseStorage connection disabled.");
}

export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL }) 
  : null;

export const db = pool 
  ? drizzle(pool, { schema }) 
  : null;
