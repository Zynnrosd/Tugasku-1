import express from "express";
import {
  getProfile,
  upsertProfile,
  updateProfile, // Import the new function
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfile);
router.post("/", upsertProfile);
router.put("/", updateProfile); // Add PUT route

export default router;