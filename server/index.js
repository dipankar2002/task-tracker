import express from 'express';
import http from 'http';
import { Server as socketIo } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const __dirname = path.resolve();
const app = express();
const server = http.createServer(app);
const io = new socketIo(server, {
  cors: {
    origin: ['http://localhost:5173'], // frontend
    credentials: true,
  },
});

// Middleware
app.use(cors({ 
  origin: 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

// DB Connection
mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB error:', err);
});

// Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/project.js';
import taskRoutes from './routes/task.js';

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// --- SOCKET.IO CONNECTION ---
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });

  // Optional: Handle task-created or task-updated from client
  socket.on('task-created', (task) => {
    socket.broadcast.emit('task-changed', task); // notify others
  });

  socket.on('task-updated', (task) => {
    socket.broadcast.emit('task-changed', task);
  });

  socket.on('task-deleted', (taskId) => {
    socket.broadcast.emit('task-removed', taskId);
  });
});

// Make io accessible in routes/controllers
app.set('io', io);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('/:path(*)', (req, res) => {
    res.sendFile(path.join(__dirname, "../client", "dist", "index.html"));
  });
}


// Start Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
