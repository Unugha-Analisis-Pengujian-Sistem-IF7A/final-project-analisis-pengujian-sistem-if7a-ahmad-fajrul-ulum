import express from "express";
import { verifyAdmin, verifyIdToken } from "../middleware/auth.middlewares.js";
import {
  createTestimoni,
  deleteTestimoni,
  getAllTestimoni,
  updateTestimoni,
} from "../controllers/testimoni.controllers.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAllTestimoni);
router.post(
  "/create",
  verifyIdToken,
  verifyAdmin,
  upload.single("testimoniImage"),
  createTestimoni
);
router.put(
  "/update/:id",
  verifyIdToken,
  verifyAdmin,
  upload.single("testimoniImage"),
  updateTestimoni
);
router.delete("/delete/:id", verifyIdToken, verifyAdmin, deleteTestimoni);

export default router;
