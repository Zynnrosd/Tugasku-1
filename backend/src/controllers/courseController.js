import { supabase } from "../config/supabaseClient.js";

export const getCourses = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { name, code, description } = req.body;

    if (!name) return res.status(400).json({ message: "Nama course wajib diisi" });

    const { data, error } = await supabase
      .from('courses')
      .insert([
        { 
          device_id: deviceId,
          name, 
          code, 
          description 
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateCourse = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { id } = req.params;
    const { name, code, description } = req.body;

    const { data, error } = await supabase
      .from('courses')
      .update({ name, code, description })
      .eq('id', id)
      .eq('device_id', deviceId) 
      .select()
      .single();

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteCourse = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { id } = req.params;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id)
      .eq('device_id', deviceId);

    if (error) throw error;
    return res.json({ message: "Berhasil dihapus" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};