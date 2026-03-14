import 'dotenv/config';
import { db } from './index.js';
import { 
  users, students, teachers, courses,
  classes, payments, progress, exams,
  courseMaterial, trialRequests, 
  parentStudent, quranProgress,
  certificates, enrollmentRequests,
  attendance, dailyProgress, messages,
  feedbackReports
} from './schema/index.js';

async function clearAll() {
  console.log('🗑️ Clearing all data...');
  try {
    // Delete in correct order (foreign keys)
    await db.delete(messages);
    await db.delete(feedbackReports);
    await db.delete(dailyProgress);
    await db.delete(attendance);
    await db.delete(certificates);
    await db.delete(quranProgress);
    await db.delete(parentStudent);
    await db.delete(trialRequests);
    await db.delete(enrollmentRequests);
    await db.delete(exams);
    await db.delete(progress);
    await db.delete(payments);
    await db.delete(courseMaterial);
    await db.delete(classes);
    await db.delete(courses);
    // Since students and teachers are aliases for users, we only need to delete users once at the end
    await db.delete(users);
    console.log('✅ All data cleared!');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
  process.exit(0);
}
clearAll();
