import { supabase } from "../config/supabaseClient.js";

export const getTasks = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { status } = req.query;

    let query = supabase
      .from("tasks")
      // Ambil data tasks DAN data courses terkait
      .select(`
        *,
        courses ( id, name, code )
      `)
      .eq('device_id', deviceId) // Filter per device
      .order("due_date", { ascending: true });
    
    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { id } = req.params;

    const { data, error } = await supabase
      .from('tasks')
      .select(`*, courses ( id, name, code )`)
      .eq('id', id)
      .eq('device_id', deviceId)
      .single();

    if (error) return res.status(404).json({ message: "Task not found" });
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { title, course_id, description, due_date, priority, status } = req.body;

    const payload = {
      device_id: deviceId, // Wajib
      title,
      course_id: course_id || null, 
      description,
      due_date,
      priority: priority || 'medium',
      status: status || 'todo'
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert([payload])
      .select(`*, courses ( id, name, code )`)
      .single();

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { id } = req.params;

    const { data, error } = await supabase
      .from("tasks")
      .update(req.body)
      .eq('id', id)
      .eq('device_id', deviceId)
      .select(`*, courses ( id, name, code )`)
      .single();

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { id } = req.params;

    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq('id', id)
      .eq('device_id', deviceId);
    
    if (error) throw error;
    return res.json({ status: "success" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};