import 'dotenv/config';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import db from './index.js';
import { users } from './schema/users.js';
import { courses } from './schema/courses.js';
import { classes } from './schema/classes.js';
import { payments } from './schema/payments.js';
import { faker } from '@faker-js/faker';

const seed = async () => {
  try {
    console.log('🌱 Starting COMPREHENSIVE database seed...\n');

    const passwordHash = await bcrypt.hash('Password@123', 10);

    // 1. Admin
    await db.insert(users).values({
      name: 'Super Admin',
      email: 'admin@quranacademy.com',
      password: passwordHash,
      role: 'admin',
      status: 'active'
    }).onConflictDoUpdate({ 
      target: users.email, 
      set: { status: 'active' } 
    });
    console.log('✅ Admin confirmed');

    // 2. Courses
    const courseData = [
      { name: 'Nazra Quran (Beginner)', description: 'Basic Quran reading with rules.', level: 'Beginner', price: 2000, duration: '3 Months' },
      { name: 'Hifz ul Quran', description: 'Complete memorization program.', level: 'Advanced', price: 4000, duration: '2 Years' },
      { name: 'Tajweed Rules', description: 'Mastering the art of recitation.', level: 'Intermediate', price: 2500, duration: '6 Months' },
      { name: 'Islamic Fundamentals', description: 'Essential knowledge for every Muslim.', level: 'Beginner', price: 1500, duration: 'Ongoing' },
      { name: 'Tafsir ul Quran', description: 'Understanding the meaning of the Holy Quran.', level: 'Advanced', price: 3000, duration: '1 Year' },
      { name: 'Arabic Language', description: 'Learn to speak and understand Arabic.', level: 'Intermediate', price: 3500, duration: '8 Months' },
    ];

    const insertedCourses = [];
    for (const c of courseData) {
      const [course] = await db.insert(courses).values({
        ...c,
        isActive: new Date()
      }).onConflictDoUpdate({
        target: courses.name,
        set: { price: c.price }
      }).returning();
      insertedCourses.push(course);
    }
    console.log(`✅ ${insertedCourses.length} Courses ready`);

    // 3. Teachers (15)
    console.log('⏳ Creating teachers...');
    const teacherIds = [];
    for (let i = 0; i < 15; i++) {
      const email = `teacher${i+1}@quranacademy.com`;
      const [teacher] = await db.insert(users).values({
        name: faker.person.fullName(),
        email,
        password: passwordHash,
        role: 'teacher',
        status: 'active',
        phone: faker.phone.number().substring(0, 30),
        specialization: faker.helpers.arrayElement(['Tajweed', 'Hifz', 'Tafsir', 'Arabic', 'Islamic' ])
      }).onConflictDoUpdate({ target: users.email, set: { status: 'active' } }).returning();
      teacherIds.push(teacher.id);
    }
    console.log('✅ 15 Teachers created');

    // 4. Students (50)
    console.log('⏳ Creating students...');
    const studentIds = [];
    for (let i = 0; i < 50; i++) {
      const email = `student${i+1}@quranacademy.com`;
      const [student] = await db.insert(users).values({
        name: faker.person.fullName(),
        email,
        password: passwordHash,
        role: 'student',
        status: i < 5 ? 'pending' : 'active',
        phone: faker.phone.number().substring(0, 30)
      }).onConflictDoUpdate({ target: users.email, set: { status: i < 5 ? 'pending' : 'active' } }).returning();
      studentIds.push(student.id);
    }
    console.log('✅ 50 Students created (5 pending)');

    // 5. Classes (Scheduled & Past)
    console.log('⏳ Generating classes...');
    const statuses = ['Scheduled', 'Completed', 'Cancelled'];
    for (let i = 0; i < 100; i++) {
      const studentId = faker.helpers.arrayElement(studentIds);
      const teacherId = faker.helpers.arrayElement(teacherIds);
      const course = faker.helpers.arrayElement(insertedCourses);
      const status = faker.helpers.arrayElement(statuses);
      
      const date = status === 'Completed' 
        ? faker.date.past() 
        : faker.date.soon();

      await db.insert(classes).values({
        studentId,
        teacherId,
        courseId: course.id,
        date: date.toISOString().split('T')[0],
        time: '10:00:00',
        duration: '45 mins',
        status: status.toLowerCase(),
        meetingLink: 'https://meet.google.com/abc-xyz-123'
      });
    }
    console.log('✅ 100 Classes generated');

    // 6. Payments
    console.log('⏳ Generating payments...');
    for (let i = 0; i < 40; i++) {
      const studentId = faker.helpers.arrayElement(studentIds);
      const course = faker.helpers.arrayElement(insertedCourses);
      const status = faker.helpers.arrayElement(['Paid', 'Unpaid', 'Pending']);
      
      const dueDate = faker.date.future();
      const paidAt = status === 'Paid' ? faker.date.recent() : null;

      await db.insert(payments).values({
        studentId,
        courseId: course.id,
        amount: course.price,
        status,
        dueDate: dueDate.toISOString().split('T')[0],
        paidAt
      });
    }
    console.log('✅ 40 Payment records generated');

    console.log('\n🎉 COMPREHENSIVE SEED COMPLETE!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

seed();
