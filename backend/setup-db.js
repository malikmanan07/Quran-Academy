import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

async function setup() {
  try {
    await client.connect();
    const res = await client.query("SELECT 1 FROM pg_database WHERE datname='quran_academy'");
    if (res.rowCount === 0) {
      console.log('Database "quran_academy" does not exist. Creating...');
      await client.query('CREATE DATABASE quran_academy');
      console.log('Database "quran_academy" created.');
    } else {
      console.log('Database "quran_academy" already exists.');
    }
    await client.end();
  } catch (err) {
    console.error('SETUP FAILED:', err.message);
    process.exit(1);
  }
}
setup();
