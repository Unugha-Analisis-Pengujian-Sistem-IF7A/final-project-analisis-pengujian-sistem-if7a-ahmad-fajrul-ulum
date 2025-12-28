
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../../firebase";
import axios from "axios";
import Toast from "../../components/Admin/common/Toast";

const Verify2FA = () => {
  const [otp, setOtp] = useState("");
  const [uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil UID dari user yang sudah login Firebase
    const user = auth.currentUser;
    if (user) {
      setUid(user.uid);
    }
  }, []);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-2fa", { uid, otp });
      setToast({ type: "success", message: res.data.message });

      setTimeout(() => {
        navigate("/admin"); // Redirect ke halaman dashboard setelah sukses verifikasi
      }, 1000);
    } catch (error) {
      setToast({
        type: "error",
        message: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8 border border-base-300"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-4">
          Verifikasi OTP
        </h2>
        <p className="text-center text-base-content/70 mb-6">
          Masukkan kode OTP yang dikirimkan ke email Anda
        </p>

        <form className="space-y-4" onSubmit={handleVerify}>
          <input
            type="text"
            placeholder="Kode OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="input input-bordered w-full"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full mt-4"
          >
            {loading ? "Memverifikasi..." : "Verifikasi OTP"}
          </button>
        </form>
      </motion.div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default Verify2FA;
