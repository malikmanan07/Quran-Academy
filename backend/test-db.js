import pkg from 'pg';
import 'dotenv/config';

const { Client } = pkg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function test() {
  try {
    await client.connect();
    console.log('CONNECTED SUCCESSFULLY');
    await client.end();
  } catch (err) {
    console.error('CONNECTION FAILED:', err.message);
    process.exit(1);
  }
}

test();
