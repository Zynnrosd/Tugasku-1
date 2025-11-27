import { supabase } from "../config/supabaseClient.js";

export const getCourses = async (req, res) => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return res.status(500).json({ message: error.message });
  return res.json({ data });
};

export const createCourse = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Nama course wajib diisi" });

  const { data, error } = await supabase
    .from("courses")
    .insert([{ name }])
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json({ data });
};

export const updateCourse = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const { data, error } = await supabase
    .from("courses")
    .update({ name })
    .eq("id", id)
    .select()
    .single();

  if (error) return res.status(500).json({ message: error.message });
  return res.json({ data });
};

export const deleteCourse = async (req, res) => {
  const { id } = req.params;
  const { error } = await supabase.from("courses").delete().eq("id", id);

  if (error) return res.status(500).json({ message: error.message });
  return res.json({ message: "Berhasil dihapus" });
};