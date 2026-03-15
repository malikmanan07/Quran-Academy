import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import env from './env.js';
import * as schema from '../db/schema/index.js';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('DB Pool Error:', err);
});

// Test the connection immediately on boot
pool.query('SELECT 1')
  .then(() => console.log('Database Connected Successfully ✅'))
  .catch((err) => console.error('Database connection failed ❌', err));

const db = drizzle(pool, { schema });

export { pool };
export default db;
