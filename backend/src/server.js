import http from 'http';
import env from './config/env.js';
import './config/db.js';
import app from './app.js';
import { initializeSocket } from './services/socketService.js';

const PORT = env.PORT;

const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
