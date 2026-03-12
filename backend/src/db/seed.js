import 'dotenv/config';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import db from './index.js';
import { users } from './schema/users.js';
import { courses } from './schema/courses.js';
import { classes } from './schema/classes.js';
import { payments } from './schema/payments.js';

const seed = async () => {
  try {
    console.log('🌱 Starting database seed...\n');

    // 1. Admin User
    const existingAdmin = await db.select().from(users).where(eq(users.email, 'admin@quranacademy.com')).limit(1);
    
    let adminId, teacherId, studentId;
    const adminHash = await bcrypt.hash('Admin@123', 10);

    if (existingAdmin.length > 0) {
      // Update existing admin to ensure correct password, status, and not deleted
      const [updatedAdmin] = await db.update(users).set({
        password: adminHash,
        status: 'active',
        deletedAt: null,
        role: 'admin',
        name: 'Super Admin',
      }).where(eq(users.email, 'admin@quranacademy.com')).returning();
      adminId = updatedAdmin.id;
      console.log('✅ Admin updated (password re-hashed, status set to active)');
      console.log('   Admin ID:', updatedAdmin.id);
      console.log('   Email:', updatedAdmin.email);
      console.log('   Role:', updatedAdmin.role);
      console.log('   Status:', updatedAdmin.status);
      console.log('   DeletedAt:', updatedAdmin.deletedAt);
    } else {
      const [admin] = await db.insert(users).values({
        name: 'Super Admin',
        email: 'admin@quranacademy.com',
        password: adminHash,
        role: 'admin',
        status: 'active'
      }).returning();
      adminId = admin.id;
      console.log('✅ Admin created');
      console.log('   Admin ID:', admin.id);
      console.log('   Email:', admin.email);
      console.log('   Role:', admin.role);
      console.log('   Status:', admin.status);
    }

    // 2. Sample Teacher
    const existingTeacher = await db.select().from(users).where(eq(users.email, 'teacher@quranacademy.com')).limit(1);
    if (existingTeacher.length > 0) {
      console.log('⚠️ Already seeded, skipping teacher user');
      teacherId = existingTeacher[0].id;
    } else {
      const teacherHash = await bcrypt.hash('Teacher@123', 10);
      const [teacher] = await db.insert(users).values({
        name: 'Ustaz Ahmad Ali',
        email: 'teacher@quranacademy.com',
        password: teacherHash,
        role: 'teacher',
        status: 'active',
        specialization: 'Tajweed'
      }).returning();
      teacherId = teacher.id;
      console.log('✅ Teacher created');
    }

    // 3. Sample Student
    const existingStudent = await db.select().from(users).where(eq(users.email, 'student@quranacademy.com')).limit(1);
    if (existingStudent.length > 0) {
      console.log('⚠️ Already seeded, skipping student user');
      studentId = existingStudent[0].id;
    } else {
      const studentHash = await bcrypt.hash('Student@123', 10);
      const [student] = await db.insert(users).values({
        name: 'Ali Hassan',
        email: 'student@quranacademy.com',
        password: studentHash,
        role: 'student',
        status: 'active'
      }).returning();
      studentId = student.id;
      console.log('✅ Student created');
    }

    // 4. Sample Courses
    const existingCourses = await db.select().from(courses).limit(1);
    let courseId;
    if (existingCourses.length > 0) {
      console.log('⚠️ Already seeded, skipping courses');
      courseId = existingCourses[0].id;
    } else {
      const insertedCourses = await db.insert(courses).values([
        {
          name: 'Nazra Quran',
          description: 'Learn to read the Quran with proper pronunciation.',
          level: 'Beginner',
          price: 2000,
          duration: '3 Months',
          isActive: new Date()
        },
        {
          name: 'Hifz ul Quran',
          description: 'Memorization of the Holy Quran.',
          level: 'Intermediate',
          price: 3500,
          duration: '1 Year',
          isActive: new Date()
        },
        {
          name: 'Tajweed ul Quran',
          description: 'Advanced Quran reading with Tajweed rules.',
          level: 'All Levels',
          price: 2500,
          duration: '6 Months',
          isActive: new Date()
        },
        {
          name: 'Islamic Studies',
          description: 'Basic Islamic knowledge and Fiqh.',
          level: 'All Ages',
          price: 1500,
          duration: 'Ongoing',
          isActive: new Date()
        }
      ]).returning();
      courseId = insertedCourses[0].id;
      console.log('✅ Courses created');
    }

    // 5. Sample Class
    const existingClasses = await db.select().from(classes).where(eq(classes.studentId, studentId)).limit(1);
    if (existingClasses.length > 0) {
      console.log('⚠️ Already seeded, skipping class');
    } else {
      // Date for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      await db.insert(classes).values({
        courseId,
        teacherId,
        studentId,
        date: tomorrow.toISOString().split('T')[0],
        startTime: '10:00:00',
        endTime: '10:45:00',
        status: 'Scheduled',
        meetingUrl: 'https://zoom.us/j/123456789'
      });
      console.log('✅ Class created');
    }

    // 6. Sample Payment
    const existingPayments = await db.select().from(payments).where(eq(payments.studentId, studentId)).limit(1);
    if (existingPayments.length > 0) {
      console.log('⚠️ Already seeded, skipping payment');
    } else {
      const year = new Date().getFullYear();
      const month = new Date().getMonth();
      const dueDate = new Date(year, month + 1, 0); // last day of current month
      
      await db.insert(payments).values({
        studentId,
        courseId,
        amount: '2000',
        status: 'Pending',
        dueDate: dueDate.toISOString().split('T')[0]
      });
      console.log('✅ Payment created');
    }

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding database:', error);
    process.exit(1);
  }
};

seed();
