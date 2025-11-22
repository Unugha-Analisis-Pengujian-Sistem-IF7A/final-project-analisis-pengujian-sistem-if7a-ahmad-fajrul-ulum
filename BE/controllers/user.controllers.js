import { upload } from "../middleware/multer.js";
import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import {
  downloadAndUpload,
  isValidImageUrl,
  uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";
import admin from "../config/firebase.js";

export const updateProfile = [
  upload.single("image"),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const {
        userName,
        email,
        fullName,
        imgProfile,
        oldPassword,
        newPassword,
      } = req.body;

      let uploadedImage;
      const firebaseUpdate = {};

      // Upload image dari file
      if (req.file) {
        uploadedImage = await uploadToCloudinary(
          req.file.buffer,
          req.file,
          "profile"
        );
      }

      // Upload dari URL
      if (!req.file && imgProfile && isValidImageUrl(imgProfile)) {
        uploadedImage = await downloadAndUpload(imgProfile, "profile");
      }

      const user = await User.findById(userId);
      if (!user)
        return res.status(404).json({ message: "User tidak ditemukan" });

      // Validasi perubahan data
      if (userName && userName !== user.userName) {
        const existingUser = await User.findOne({ userName });
        if (existingUser)
          return res.status(400).json({ message: "Username sudah digunakan" });
        firebaseUpdate.displayName = fullName || user.fullName; // Optional
      }

      if (email && email !== user.email) {
        const existingEmail = await User.findOne({ email });
        if (existingEmail)
          return res.status(400).json({ message: "Email sudah digunakan" });
        firebaseUpdate.email = email;
      }

      if (fullName && fullName !== user.fullName) {
        firebaseUpdate.displayName = fullName;
      }

      if (uploadedImage) {
        firebaseUpdate.photoURL = uploadedImage.url;
      }

      if (imgProfile === "remove") {
        firebaseUpdate.photoURL = "";
      }

      if (oldPassword && newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
          return res.status(400).json({ message: "Password lama salah" });
        firebaseUpdate.password = newPassword; // plain text
      }

      // Kalau tidak ada perubahan apa pun
      const noChange =
        !userName &&
        !email &&
        !fullName &&
        !uploadedImage &&
        imgProfile !== "remove" &&
        !(oldPassword && newPassword);

      if (noChange) {
        return res.status(200).json({ message: "Tidak ada perubahan" });
      }

      // Firebase update dulu
      if (user.firebaseId && Object.keys(firebaseUpdate).length > 0) {
        console.log("🔄 Updating Firebase for:", user.firebaseId);
        console.log("With:", firebaseUpdate);
        try {
          await admin.auth().updateUser(user.firebaseId, firebaseUpdate);
          console.log("✅ Firebase updated");
        } catch (error) {
          console.error(
            "❌ Firebase update failed:",
            error.code,
            error.message
          );
          return res.status(500).json({
            message: "Gagal update data di Firebase",
            error: error.message,
          });
        }
      }
      console.log("👉 firebaseId:", user.firebaseId);
      console.log("👉 firebaseUpdate object:", firebaseUpdate);

      // Setelah Firebase berhasil, baru update MongoDB
      if (userName) user.userName = userName;
      if (email) user.email = email;
      if (fullName) user.fullName = fullName;
      if (uploadedImage) user.imgProfile = uploadedImage.url;
      if (imgProfile === "remove") user.imgProfile = "";
      if (oldPassword && newPassword) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }

      const updatedUser = await user.save();
      console.log("✅ MongoDB updated:", updatedUser);

      return res.status(200).json({
        message: "Profil berhasil diperbarui",
        user: {
          _id: updatedUser._id,
          userName: updatedUser.userName,
          email: updatedUser.email,
          fullName: updatedUser.fullName,
          imgProfile: updatedUser.imgProfile,
          role: updatedUser.role,
        },
      });
    } catch (error) {
      console.error("❌ Gagal update profil:", error);
      return res.status(500).json({
        message: "Terjadi kesalahan saat update profil",
        error: error.message,
      });
    }
  },
];
