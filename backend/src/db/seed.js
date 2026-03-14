import 'dotenv/config';
import { db } from './index.js';
import { users } from './schema/index.js';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding admin...');
  try {
    // Check if admin exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, 'admin@quranacademy.com'))
      .limit(1);

    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    if (existing.length > 0) {
      // Update existing admin
      await db
        .update(users)
        .set({
          password: hashedPassword,
          status: 'active',
          role: 'admin',
          deletedAt: null,
        })
        .where(eq(users.email, 'admin@quranacademy.com'));
      console.log('✅ Admin updated!');
    } else {
      // Create new admin
      await db.insert(users).values({
        name: 'Admin',
        email: 'admin@quranacademy.com',
        password: hashedPassword,
        role: 'admin',
        status: 'active',
        phone: '+923001234567',
      });
      console.log('✅ Admin created!');
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Admin credentials:');
    console.log('Email: admin@quranacademy.com');
    console.log('Password: Admin@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}
seed();
