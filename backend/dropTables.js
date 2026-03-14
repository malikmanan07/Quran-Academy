import db from './src/config/db.js';
import { sql } from 'drizzle-orm';

async function drop() {
  await db.execute(sql`DROP TABLE IF EXISTS messages CASCADE;`);
  await db.execute(sql`DROP TABLE IF EXISTS feedback_reports CASCADE;`);
  console.log('Tables dropped');
  process.exit(0);
}

drop().catch(console.error);
