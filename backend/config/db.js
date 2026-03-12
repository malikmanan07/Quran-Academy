import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
import dotenv from 'dotenv';
import * as schema from '../drizzle/schema.js';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Database Connected Successfully ✅'))
  .catch((err) => console.log('Database Connection Failed ❌', err.message));

const db = drizzle(pool, { schema });

export default db;