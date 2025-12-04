import express from "express";
import { getProfile, updateProfile } from "../controllers/profileController.js";

const router = express.Router();

router.route("/")
    .get(getProfile)
    .post(updateProfile)
    .put(updateProfile); 

router.get("/:id", getProfile); 

export default router;