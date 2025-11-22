import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { getMe, updateProfile } from "../../../app/users/authSlice";

const EditProfileForm = ({ open, onClose, profile }) => {
  const [form, setForm] = useState({
    fullName: "",
    userName: "",
    email: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [currentTab, setCurrentTab] = useState("profile"); // Untuk switching antara tab
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        userName: profile.userName || "",
        email: profile.email || "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (!open) {
      setForm({
        fullName: "",
        userName: "",
        email: "",
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setImage(null);
      setMessage("");
      setShowPasswordFields(false);
    }
  }, [open]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (showPasswordFields) {
      if (form.newPassword.length < 6) {
        setMessage("Password baru minimal 6 karakter.");
        setLoading(false);
        return;
      }
      if (form.newPassword !== form.confirmPassword) {
        setMessage("Konfirmasi password tidak cocok.");
        setLoading(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("userName", form.userName);
    formData.append("email", form.email);
    if (showPasswordFields) {
      formData.append("oldPassword", form.oldPassword);
      formData.append("newPassword", form.newPassword);
    }
    if (image) formData.append("image", image);

    try {
      await dispatch(updateProfile(formData)).unwrap();
      await dispatch(getMe()).unwrap();
      setMessage("Profil berhasil diperbarui.");
      onClose();
    } catch (err) {
      setMessage(err?.response?.data?.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="modal-box max-w-lg w-full px-6 py-5 sm:px-8 bg-base-100 rounded-lg shadow-xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-primary">Edit Profil</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500">
            <FaRegTimesCircle size={22} />
          </button>
        </div>

        {message && (
          <div className="text-sm text-red-500 text-center mb-3">{message}</div>
        )}

        {/* Tab Navigation */}
        <div className="tabs flex justify-start mb-4">
          <button
            onClick={() => setCurrentTab("profile")}
            className={`tab tab-bordered ${currentTab === "profile" ? "tab-active" : ""}`}
          >
            Profil
          </button>
          <button
            onClick={() => setCurrentTab("password")}
            className={`tab tab-bordered ${currentTab === "password" ? "tab-active" : ""}`}
          >
            Ubah Password
          </button>
        </div>

        {/* Form for Profil */}
        {currentTab === "profile" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nama Lengkap</label>
              <input
                type="text"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input
                type="text"
                name="userName"
                value={form.userName}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Foto Profil (opsional)</label>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="file-input file-input-bordered w-full"
              />
              {image && (
                <p className="text-sm mt-1 text-green-600">{image.name}</p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        )}

        {/* Form for Password */}
        {currentTab === "password" && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Password Lama</label>
              <input
                type="password"
                name="oldPassword"
                value={form.oldPassword}
                onChange={handleChange}
                className="input input-bordered w-full"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Password Baru</label>
                <input
                  type="password"
                  name="newPassword"
                  value={form.newPassword}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Konfirmasi Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
              >
                Batal
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </dialog>
  );
};

export default EditProfileForm;
