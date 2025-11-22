import express from "express";
import {
  createHero,
  deleteHero,
  getHero,
  updateHero,
} from "../controllers/hero.controllers.js";
import { verifyAdmin, verifyIdToken } from "../middleware/auth.middlewares.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getHero);
router.post(
  "/create",
  verifyIdToken,
  verifyAdmin,
  upload.single("heroImage"),
  createHero
);
router.put(
  "/update/:id",
  verifyIdToken,
  verifyAdmin,
  upload.single("heroImage"),
  updateHero
);
router.delete("/delete/:id", verifyIdToken, verifyAdmin, deleteHero);

export default router;
