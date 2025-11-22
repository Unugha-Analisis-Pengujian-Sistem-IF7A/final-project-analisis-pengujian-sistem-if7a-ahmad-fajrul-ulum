import mongoose from "mongoose";

const iklanSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    iklanImage: {
      type: String,
    },
    link: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Iklan", iklanSchema);
