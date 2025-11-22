import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    firebaseId: {
      type: String,
      unique: true, // memastikan firebaseId unik
      sparse: true, // akan diabaikan jika null (untuk mengatasi user pertama kali)},
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      trim: true,
    },
    imgProfile: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    otpCode: {
      type: String,
    },
    otpExpire: {
      type: Date,
    },
    is2faEnabled: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
