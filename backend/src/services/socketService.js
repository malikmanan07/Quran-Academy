import { Server } from 'socket.io';
import env from '../config/env.js';
import corsOptions from '../config/cors.js';

let io;
const connectedUsers = new Map(); // userId -> socket.id

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: corsOptions,
  });

  io.on('connection', (socket) => {
    // Client should emit 'register' with their user ID upon connecting
    socket.on('register', (userId) => {
      connectedUsers.set(String(userId), socket.id);
      console.log(`Socket User Registered: ${userId}`);
    });

    socket.on('disconnect', () => {
      // Clean up the user when disconnect occurs
      for (const [userId, socketId] of connectedUsers.entries()) {
        if (socketId === socket.id) {
          connectedUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

// Function to send a notification to a specific user
export const sendNotification = (userId, message, type = 'info') => {
  if (!io) return;

  const socketId = connectedUsers.get(String(userId));
  if (socketId) {
    // Generate a unique ID for the notification for frontend tracking
    const notification = {
      id: Date.now().toString(),
      message,
      type, // 'info', 'success', 'warning', 'error'
      isRead: false,
      timestamp: new Date().toISOString()
    };
    
    io.to(socketId).emit('notification', notification);
  }
};
