import pkg from 'pg';
const { Client } = pkg;

const passwords = ['password', 'postgres', 'admin', 'root', '123456', ''];
const dbName = 'quran_academy';

async function tryConnect(password) {
  const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // connect to default postgres db first
    password: password,
    port: 5432,
  });
  try {
    await client.connect();
    console.log(`SUCCESS WITH PASSWORD: "${password}"`);
    await client.end();
    return true;
  } catch (err) {
    console.log(`FAILED WITH PASSWORD: "${password}" - ${err.message}`);
    return false;
  }
}

async function run() {
  for (const pw of passwords) {
    if (await tryConnect(pw)) break;
  }
}

run();
