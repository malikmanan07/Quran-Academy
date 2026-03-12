import 'dotenv/config';
import db from './index.js';
import { sql } from 'drizzle-orm';

const clear = async () => {
  try {
    console.log('🗑️ Clearing database...');
    // Order matters if there are foreign keys, or use CASCADE
    await db.execute(sql`TRUNCATE TABLE payments, classes, courses, users CASCADE`);
    console.log('✅ Database cleared');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
};

clear();
