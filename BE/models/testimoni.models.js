import mongoose from "mongoose";

const testimoniSchema = new mongoose.Schema(
  {
    id: { type: String },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    testimoniImage: {
      type: String,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Minimum rating is 1"],
      max: [5, "Maximum rating is 5"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Testimoni", testimoniSchema);
