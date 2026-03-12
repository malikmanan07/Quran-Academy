import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import env from './env.js';
import * as schema from '../db/schema/index.js';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Database Connected ✅'))
  .catch((err) => console.log('DB Connection Failed ❌', err.message));

const db = drizzle(pool, { schema });

export default db;
