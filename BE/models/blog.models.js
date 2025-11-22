import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blogId: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      default: "Admin",
    },
    blogImage: {
      type: String,
    },
    status: {
      type: String,
      enum: ["draft", "publish"],
      default: "draft",
    },
  },
  { timestamps: true }
);

blogSchema.index({ title: "text", content: "text" });
blogSchema.index({ blogId: 1 });

export default mongoose.model("Blog", blogSchema);
