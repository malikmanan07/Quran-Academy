import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Client } = pg;

async function reset() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL not found in .env');
    process.exit(1);
  }

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false } // Required for some Supabase connections
  });

  try {
    await client.connect();
    console.log('🚀 Connected to Supabase / PG database...');

    const tables = [
      'progress',
      'exams',
      'course_material',
      'payments',
      'classes',
      'courses',
      'students',
      'teachers',
      'users',
      'attendance', // Saw this in schema too
      '__drizzle_migrations'
    ];

    for (const table of tables) {
      console.log(`🗑️ Dropping table: ${table}...`);
      await client.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`);
    }

    console.log('✅ All tables dropped successfully');
  } catch (err) {
    console.error('❌ Error dropping tables:', err);
  } finally {
    await client.end();
  }
}

reset();
