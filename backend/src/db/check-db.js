import 'dotenv/config';
import db from './index.js';
import { users } from './schema/users.js';

async function check() {
  try {
    const allUsers = await db.select().from(users).limit(1);
    console.log('Database Connection: SUCCESS');
    console.log('User count:', allUsers.length);
    process.exit(0);
  } catch (err) {
    console.error('Database Connection: FAILED');
    console.error(err);
    process.exit(1);
  }
}

check();
