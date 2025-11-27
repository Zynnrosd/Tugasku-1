import { supabase } from "../config/supabaseClient.js";
import { success, error } from "../utils/response.js";

export const getProfile = async (req, res) => {
  const { data, error: err } = await supabase
    .from("profiles")
    .select("*")
    .limit(1)
    .single();

  if (err) return error(res, err.message, 500);
  return success(res, data);
};

export const upsertProfile = async (req, res) => {
  const { data, error: err } = await supabase
    .from("profiles")
    .upsert(req.body)
    .select()
    .single();

  if (err) return error(res, err.message, 400);
  return success(res, data, "Profile updated");
};

// --- ADD THIS FUNCTION ---
export const updateProfile = async (req, res) => {
  // We assume updating the single profile or by ID if passed
  // For this app, upsert is often enough, but specific update is safer
  const { id, name, student_id, bio, major } = req.body;

  const { data, error: err } = await supabase
    .from("profiles")
    .update({ name, student_id, bio, major })
    .eq('id', id) // Frontend must send the ID
    .select()
    .single();

  if (err) return error(res, err.message, 400);
  return success(res, data, "Profile updated");
};