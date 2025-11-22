import express from "express";
import {
  deleteAllNotifications,
  deleteOneNotification,
  getAllNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../controllers/notification.controllers.js";
import { verifyAdmin, verifyIdToken } from "../middleware/auth.middlewares.js";

const router = express.Router();

router.get("/", verifyIdToken, verifyAdmin, getAllNotifications);
router.delete("/:id", verifyIdToken, verifyAdmin, deleteOneNotification);
router.delete("/", verifyIdToken, verifyAdmin, deleteAllNotifications);
router.put("/read/:id", verifyIdToken, verifyAdmin, markNotificationAsRead);
router.put("/read-all", verifyIdToken, verifyAdmin, markAllNotificationsAsRead);

export default router;
