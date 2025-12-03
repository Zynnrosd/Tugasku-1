import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import tasksRouter from './routes/tasks.js';
import coursesRouter from './routes/courses.js';
import profilesRouter from './routes/profiles.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "device-id"]
}));

app.options("*", cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url}`);
  next();
});

app.use('/api/tasks', tasksRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/profiles', profilesRouter);

app.get('/', (req, res) => {
  res.json({ status: "API Online", message: "Welcome to TugasKu API" });
});

export default app;
