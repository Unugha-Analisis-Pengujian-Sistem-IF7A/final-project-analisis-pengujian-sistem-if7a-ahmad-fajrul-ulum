import mongoose from "mongoose";

const heroSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    heroImage: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Hero", heroSchema);
