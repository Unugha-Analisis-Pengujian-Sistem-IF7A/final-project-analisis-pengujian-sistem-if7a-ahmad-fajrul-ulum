import express from "express";
import { verifyAdmin, verifyIdToken } from "../middleware/auth.middlewares.js";
import {
  createLogoPT,
  deleteLogoPT,
  getLogoPT,
  updateLogoPT,
} from "../controllers/logoPT.controllers.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getLogoPT);
router.post(
  "/create",
  verifyIdToken,
  verifyAdmin,
  upload.single("logoPTImage"),
  createLogoPT
);
router.put(
  "/update/:id",
  verifyIdToken,
  verifyAdmin,
  upload.single("logoPTImage"),
  updateLogoPT
);
router.delete("/delete/:id", verifyIdToken, verifyAdmin, deleteLogoPT);

export default router;
