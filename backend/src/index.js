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
// Semuanya menggunakan prefix /api/
app.use('/api/tasks', tasksRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/profiles', profilesRouter);

// Root Endpoint - Mengembalikan daftar endpoints sebagai array of objects yang rapi
app.get('/', (req, res) => {
  // Mendapatkan URL Host secara dinamis untuk Vercel deployment
  const deployedUrl = req.protocol + '://' + req.get('host');
  
  const endpointList = [
    {
      id: "api_root_info",
      entity: "Informasi Server",
      description: "Status server dan detail dasar API.",
      path: "/",
      methods: [{ method: "GET", action: "Melihat daftar ini" }],
      server: {
        status: "Online",
      }
    },
    {
      id: "tasks_management",
      entity: "Tugas (Tasks)",
      description: "Mengelola tugas harian dan deadline.",
      path: "/api/tasks",
      methods: [
        { method: "GET", action: "Mengambil semua tugas", usage: `${deployedUrl}/api/tasks` },
        { method: "POST", action: "Membuat tugas baru", usage: `${deployedUrl}/api/tasks` }
      ],
      details: {
        update: { method: "PUT", usage: `${deployedUrl}/api/tasks/:id` },
        delete: { method: "DELETE", usage: `${deployedUrl}/api/tasks/:id` },
        get_by_id: { method: "GET", usage: `${deployedUrl}/api/tasks/:id` }
      },
      note: "Endpoints ini dilindungi dan memerlukan header otentikasi."
    },
    {
      id: "courses_management",
      entity: "Mata Kuliah (Courses)",
      description: "Mengelola daftar mata kuliah (course).",
      path: "/api/courses",
      methods: [
        { method: "GET", action: "Mengambil semua mata kuliah", usage: `${deployedUrl}/api/courses` },
        { method: "POST", action: "Menambah mata kuliah baru", usage: `${deployedUrl}/api/courses` }
      ],
      details: {
        delete: { method: "DELETE", usage: `${deployedUrl}/api/courses/:id` }
      },
      note: "Endpoints ini dilindungi dan memerlukan header otentikasi."
    },
    {
      id: "profile_management",
      entity: "Profil Pengguna (Profiles)",
      description: "Mengelola data profil dan identitas mahasiswa.",
      path: "/api/profiles",
      methods: [
        { method: "GET", action: "Mengambil data profil pengguna", usage: `${deployedUrl}/api/profiles` },
        { method: "POST", action: "Membuat atau mengupdate data profil", usage: `${deployedUrl}/api/profiles` }
      ],
      note: "Endpoints ini dilindungi dan memerlukan header otentikasi Supabase."
    }
  ];

  res.json(endpointList);
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