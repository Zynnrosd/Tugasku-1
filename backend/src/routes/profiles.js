import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.route("/")
    .get(getProfile) // GET /api/profiles (Mengambil profile pengguna berdasarkan device-id dari header)
    .post(updateProfile) // POST /api/profiles
    .put(updateProfile); // PUT /api/profiles

// --- PENTING: MENGAKTIFKAN RUTE DINAMIS /profiles/:id ---
// Karena rute ini menangani parameter ID, kita harus memetakannya. 
// Asumsi: Kita menggunakan controller yang ada, getProfile, dan membiarkan 
// controller tersebut menggunakan device-id dari header.
router.get("/:id", getProfile); 

export default router;