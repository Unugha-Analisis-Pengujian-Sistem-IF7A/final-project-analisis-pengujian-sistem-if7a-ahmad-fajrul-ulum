import { upload } from "../middleware/multer.js";
import bcrypt from "bcrypt";
import User from "../models/user.models.js";
import {
  downloadAndUpload,
  isValidImageUrl,
  uploadToCloudinary,
} from "../utils/uploadToCloudinary.js";
import admin from "../config/firebase.js";

const handleImageUpload = async (req, imgProfile) => {
  if (req.file) {
    return await uploadToCloudinary(req.file.buffer, req.file, "profile");
  }
  if (imgProfile && isValidImageUrl(imgProfile)) {
    return await downloadAndUpload(imgProfile, "profile");
  }
  return null;
};

const checkDuplicates = async (userName, email, user) => {
  if (userName && userName !== user.userName) {
    const existingUser = await User.findOne({ userName });
    if (existingUser) throw new Error("Username sudah digunakan");
  }
  if (email && email !== user.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) throw new Error("Email sudah digunakan");
  }
};

const prepareFirebaseUpdates = (user, { fullName, email, uploadedImage, imgProfile }) => {
  const firebaseUpdate = {};
  if (fullName && fullName !== user.fullName) firebaseUpdate.displayName = fullName;
  if (email && email !== user.email) firebaseUpdate.email = email;
  if (uploadedImage) firebaseUpdate.photoURL = uploadedImage.url;
  if (imgProfile === "remove") firebaseUpdate.photoURL = "";

  // Optional: Update display name if username changes but fullname doesn't
  // firebaseUpdate.displayName = fullName || user.fullName; 

  return firebaseUpdate;
};

const syncFirebase = async (user, firebaseUpdate) => {
  if (user.firebaseId && Object.keys(firebaseUpdate).length > 0) {

    try {
      await admin.auth().updateUser(user.firebaseId, firebaseUpdate);
      console.log("✅ Firebase updated");
    } catch (error) {
      console.error("❌ Firebase update failed:", error);
      throw new Error(`Gagal update data di Firebase: ${error.message}`);
    }
  }
};

export const updateProfile = [
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.user) return res.status(401).json({ message: "Unauthorized" });
      const user = await User.findById(req.user._id);
      if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

      const { userName, email, fullName, imgProfile, oldPassword, newPassword } = req.body;

      // 1. Handle Image Upload
      const uploadedImage = await handleImageUpload(req, imgProfile);

      // 2. Check Duplicates
      try {
        await checkDuplicates(userName, email, user);
      } catch (error) {
        return res.status(400).json({ message: error.message });
      }

      // 3. Prepare Updates
      const firebaseUpdate = prepareFirebaseUpdates(user, { fullName, email, uploadedImage, imgProfile });

      // 4. Password Handling
      if (oldPassword && newPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) return res.status(400).json({ message: "Password lama salah" });

        firebaseUpdate.password = newPassword;
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }

      // 5. Check for Changes
      const hasChanges = userName || email || fullName || uploadedImage ||
        imgProfile === "remove" || (oldPassword && newPassword);

      if (!hasChanges) return res.status(200).json({ message: "Tidak ada perubahan" });

      // 6. Sync Firebase
      await syncFirebase(user, firebaseUpdate);

      // 7. Update MongoDB
      if (userName) user.userName = userName;
      if (email) user.email = email;
      if (fullName) user.fullName = fullName;
      if (uploadedImage) user.imgProfile = uploadedImage.url;
      if (imgProfile === "remove") user.imgProfile = "";

      const updatedUser = await user.save();
      console.log("✅ MongoDB updated");

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
      const status = 500;
      return res.status(status).json({
        message: "Terjadi kesalahan saat update profil",
        error: error.message,
      });
    }
  },
];
