import express from 'express';
import cors from 'cors';
import { logger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';
import tasksRouter from './routes/tasks.js';
import coursesRouter from './routes/courses.js';
import profilesRouter from './routes/profiles.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api/tasks', tasksRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/profiles', profilesRouter);

app.get('/', (req, res) => res.json({ message: 'Tugasku backend' }));
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
