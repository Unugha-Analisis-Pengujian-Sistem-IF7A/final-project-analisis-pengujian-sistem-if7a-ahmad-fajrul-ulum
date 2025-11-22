import mongoose from "mongoose";

const logoPTSchema = new mongoose.Schema(
  {
    id: { type: String },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    logoPTImage: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("LogoPT", logoPTSchema);
