import express from "express";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
  verify2FA,
} from "../controllers/auth.controllers.js";
import { verifyIdToken } from "../middleware/auth.middlewares.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyIdToken, getMe);
router.post("/logout", logout);
router.post("/verify-2fa", verify2FA);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
