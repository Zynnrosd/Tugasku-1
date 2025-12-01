import { supabase } from "../config/supabaseClient.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    if (!deviceId) return res.status(400).json({ message: 'Device ID missing' });

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('device_id', deviceId)
      .single();

    // Code PGRST116 = Data tidak ditemukan (user baru), kita return object kosong aman
    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return res.json({ data: data || {} }); 
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// Update / Create Profile (Upsert)
export const updateProfile = async (req, res) => {
  try {
    const deviceId = req.headers['device-id'];
    const { name, student_id, email, bio } = req.body;

    if (!deviceId) return res.status(400).json({ message: 'Device ID missing' });

    const { data, error } = await supabase
      .from('profiles')
      .upsert(
        { 
          device_id: deviceId, // Kunci unik
          name, 
          student_id, 
          email, 
          bio,
          updated_at: new Date()
        }, 
        { onConflict: 'device_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};