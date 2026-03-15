import env from './env.js';

const corsOptions = {
  origin: env.NODE_ENV === 'development' ? true : env.ALLOWED_ORIGINS.split(',').map(o => o.trim()),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export default corsOptions;
