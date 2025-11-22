import express from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  updateBlog,
} from "../controllers/blog.controllers.js";
import { verifyAdmin, verifyIdToken } from "../middleware/auth.middlewares.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.post(
  "/create",
  verifyIdToken,
  verifyAdmin,
  upload.single("blogImage"),
  createBlog
);
router.put(
  "/update/:id",
  verifyIdToken,
  verifyAdmin,
  upload.single("blogImage"),
  updateBlog
);
router.delete("/delete/:id", verifyIdToken, verifyAdmin, deleteBlog);

export default router;
