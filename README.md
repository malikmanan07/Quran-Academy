# Quran Academy Management System

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: PostgreSQL + Drizzle ORM
- Auth: JWT

## Features
- Landing page
- Role-based auth (Admin/Teacher/Student)
- Student approval flow
- Admin panel (students, teachers, courses, classes, payments)
- Teacher panel (schedule, progress, materials)
- Student panel (courses, progress, exams, payments)

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

## Default Credentials
- Admin: admin@quranacademy.com / Admin@123
- Teacher: teacher@quranacademy.com / Teacher@123
- Student: student@quranacademy.com / Student@123

## Folder Structure
```
Quran Academy/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & environment configurations
│   │   ├── db/           # Drizzle schema, migrations, and seed logic
│   │   ├── middlewares/  # Express middlewares (Auth, roles, validation)
│   │   ├── modules/      # Domain specific controllers, routes, and services
│   │   ├── utils/        # Generic helpers like error mapping & pagination
│   │   └── app.js & server.js
│   ├── drizzle.config.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── assets/       # Static static image/icon assets
    │   ├── components/   # Reusable UI React components (buttons, layout, specific modules)
    │   ├── constants/    # Fixed configs like Roles, API Routes
    │   ├── context/      # React Context (Auth State)
    │   ├── features/     # Feature silos (Auth hooks & logic)
    │   ├── pages/        # Route entry-point pages
    │   ├── services/     # Http Interceptor and Local Storage utilities
    │   ├── styles/       # Tailwind CSS Globals
    │   ├── utils/        # Shared frontend formatters
    │   └── App.jsx & main.jsx
    └── package.json
```
