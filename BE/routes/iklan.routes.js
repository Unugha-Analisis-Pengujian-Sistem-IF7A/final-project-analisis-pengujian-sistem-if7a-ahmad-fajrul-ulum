import express from "express";
import { verifyAdmin, verifyIdToken } from "../middleware/auth.middlewares.js";
import {
  createIklan,
  deleteIklan,
  getIklan,
  updateIklan,
} from "../controllers/iklan.controllers.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getIklan);
router.post(
  "/create",
  verifyIdToken,
  verifyAdmin,
  upload.single("iklanImage"),
  createIklan
);
router.put(
  "/update/:id",
  verifyIdToken,
  verifyAdmin,
  upload.single("iklanImage"),
  updateIklan
);
router.delete("/delete/:id", verifyIdToken, verifyAdmin, deleteIklan);

export default router;
