import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import env from './env.js';
import * as schema from '../db/schema/index.js';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
  ssl: { rejectUnauthorized: false }
});

pool.on('connect', () => {
  console.log('Database Connected ✅');
});

pool.on('error', (err) => {
  console.error('DB Pool Error:', err);
});

const db = drizzle(pool, { schema });

export { pool };
export default db;
