import pkg from 'pg';
const { Client } = pkg;

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'admin',
  port: 5432,
});

async function test() {
  try {
    await client.connect();
    console.log('CONNECTED WITH admin');
    await client.end();
  } catch (err) {
    console.log('FAILED WITH admin:', err.message);
  }
}
test();
