import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfile);

// Baik Create (POST) maupun Update (PUT) akan ditangani oleh updateProfile (Logic Upsert)
router.post("/", updateProfile); 
router.put("/", updateProfile);

export default router;