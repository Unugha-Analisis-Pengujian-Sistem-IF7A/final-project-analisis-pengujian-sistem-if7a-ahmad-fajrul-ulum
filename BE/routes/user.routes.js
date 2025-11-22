import express from "express";
import { updateProfile } from "../controllers/user.controllers.js";
import { verifyIdToken } from "../middleware/auth.middlewares.js";

const router = express.Router();

// Update profil user yang sedang login
router.put("/profile", verifyIdToken, updateProfile); // Bisa tambahkan verifyAdmin kalau hanya admin

export default router;
