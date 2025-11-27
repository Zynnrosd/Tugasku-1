import { supabase } from "../config/supabaseClient.js";

/**
 * Helper: attach course_name to task list (efficient enough for TA)
 */
const attachCourseNames = async (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) return tasks;
  
  // collect course_ids
  const ids = [...new Set(tasks.map(t => t.course_id).filter(Boolean))];
  
  if (ids.length === 0) return tasks.map(t => ({ ...t, course_name: null }));

  const { data: courses } = await supabase
    .from('courses')
    .select('id, name')
    .in('id', ids);

  const map = {};
  (courses || []).forEach(c => { map[c.id] = c.name; });

  // Kembalikan object task dengan tambahan properti course_name & courses (untuk frontend yg butuh courses.name)
  return tasks.map(t => ({ 
      ...t, 
      course_name: t.course_id ? map[t.course_id] || null : null,
      courses: t.course_id ? { name: map[t.course_id] } : null // Fallback object biar frontend ga error
  }));
};

export const getTasks = async (req, res) => {
  // optional query filters
  const { status } = req.query;
  let builder = supabase.from("tasks").select("*").order("created_at", { ascending: false });
  
  if (status) builder = builder.eq('status', status);

  const { data, error } = await builder;
  
  if (error) return res.status(500).json({ message: error.message });

  const withNames = await attachCourseNames(data);
  
  // PENTING: Bungkus dengan { data: ... } agar cocok dengan frontend (res.data.data)
  return res.json({ data: withNames }); 
};

export const getTaskById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ message: error.message });

  const [withName] = await attachCourseNames([data]);
  return res.json({ data: withName });
};

export const createTask = async (req, res) => {
  const payload = req.body;
  // defaults
  payload.priority = payload.priority || 'Medium'; // Sesuaikan casing dengan frontend
  payload.status = payload.status || 'Pending';

  const { data, error } = await supabase
    .from("tasks")
    .insert([payload])
    .select();

  if (error) return res.status(400).json({ message: error.message });
  
  const [created] = data;
  const [withName] = await attachCourseNames([created]);
  return res.json({ data: withName });
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("tasks")
    .update(req.body)
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(400).json({ message: error.message });
  
  const [withName] = await attachCourseNames([data]);
  return res.json({ data: withName });
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  
  if (error) return res.status(400).json({ message: error.message });
  return res.json({ status: "success" });
};