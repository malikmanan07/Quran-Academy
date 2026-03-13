import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const { Client } = pg;

async function clean() {
  const connectionString = process.env.DATABASE_URL;
  const client = new Client({ connectionString });

  try {
    await client.connect();
    console.log('Cleaning classes and payments...');
    await client.query('DELETE FROM classes');
    await client.query('DELETE FROM payments');
    console.log('Success!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

clean();
