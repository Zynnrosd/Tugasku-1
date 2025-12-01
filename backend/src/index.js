import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import Routes (Wajib pakai .js di akhir filename)
import tasksRouter from './routes/tasks.js';
import coursesRouter from './routes/courses.js';
import profilesRouter from './routes/profiles.js';

// Load env vars
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Logger sederhana (pengganti middleware logger jika file logger.js belum ada/error)
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} | Device: ${req.headers['device-id'] || 'No-ID'}`);
  next();
});

// Routes
app.use('/api/tasks', tasksRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/profiles', profilesRouter);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Backend API Tugasku is Running! 🚀',
    status: 'Server On',
    author: 'Zyan'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;