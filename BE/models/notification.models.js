import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    id: { type: String },
    from: {
      type: String,
      required: true,
      
    },
    to: {
      type: String,
      required: true,
      default: "admin",
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["update", "create", "delete", "info"],
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ to: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
