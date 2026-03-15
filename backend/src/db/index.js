import db from '../config/db.js';
import { pool } from '../config/db.js';

// Query timing in development mode
if (process.env.NODE_ENV === 'development') {
  const originalQuery = pool.query.bind(pool);
  pool.query = async (...args) => {
    const start = Date.now();
    const result = await originalQuery(...args);
    const duration = Date.now() - start;
    if (duration > 100) {
      console.warn(`Slow query (${duration}ms):`, args[0]?.text || args[0]);
    }
    return result;
  };
}

export { db };
export default db;
