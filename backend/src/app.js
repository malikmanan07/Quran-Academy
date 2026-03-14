import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import corsOptions from './config/cors.js';
import errorHandler from './middlewares/errorHandler.js';
import notFound from './middlewares/notFound.js';

// Module Routes
import authRoutes from './modules/auth/auth.routes.js';
import studentsRoutes from './modules/students/students.routes.js';
import teachersRoutes from './modules/teachers/teachers.routes.js';
import coursesRoutes from './modules/courses/courses.routes.js';
import classesRoutes from './modules/classes/classes.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import progressRoutes from './modules/progress/progress.routes.js';
import examsRoutes from './modules/exams/exams.routes.js';
import courseMaterialRoutes from './modules/course-material/courseMaterial.routes.js';
import statsRoutes from './modules/stats/stats.routes.js';
import adminUserRoutes from './modules/users/users.routes.js';
import certificatesRoutes from './modules/certificates/certificates.routes.js';
import parentRoutes from './modules/parent/parent.routes.js';
import trialRoutes from './modules/trial/trial.routes.js';
import quranProgressRoutes from './modules/quran-progress/quran-progress.routes.js';
import dailyProgressRoutes from './modules/daily-progress/daily-progress.routes.js';
import enrollmentRoutes from './modules/enrollments/enrollments.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import messagesRoutes from './modules/messages/messages.routes.js';
import feedbackRoutes from './modules/feedback/feedback.routes.js';

const app = express();

// Security & Parsing
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 2000, // Increased for development
  message: { success: false, message: 'Too many requests, try again later.' },
});
app.use('/api', limiter);

// Health Check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Quran Academy API Running ✅' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/teachers', teachersRoutes);
app.use('/api/courses', coursesRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/exams', examsRoutes);
app.use('/api/course-material', courseMaterialRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminUserRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/trial', trialRoutes);
app.use('/api/quran-progress', quranProgressRoutes);
app.use('/api/daily-progress', dailyProgressRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/feedback', feedbackRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
