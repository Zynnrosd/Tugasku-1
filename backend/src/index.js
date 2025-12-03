import express from 'express';
import cors from 'cors';
import tasksRouter from '../backend/src/routes/tasks.js';
import coursesRouter from '../backend/src/routes/courses.js';
import profilesRouter from '../backend/src/routes/profiles.js';

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "device-id"],
}));

app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/profiles', profilesRouter);

// Root
app.get('/api', (req, res) => {
  res.json({ message: "API Connected 🚀" });
});

export default app;
