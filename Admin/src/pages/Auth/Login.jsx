/* eslint-disable no-unused-vars */
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";

import { login } from "../../app/users/authSlice";
import { auth } from "../../firebase";
import Toast from "../../components/Admin/common/Toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    try {
      // Firebase authentication
      await signInWithEmailAndPassword(auth, email, password);

      // Dispatch to Redux
      await dispatch(login({ email, password })).unwrap();

      setToast({ type: "success", message: "Login berhasil" });

      setTimeout(() => {
        // navigate("/verify-2fa");
               navigate("/admin");
      }, 500);
    } catch (error) {
      console.error("Login failed:", error);
      setToast({
        type: "error",
        message: error?.message || "Terjadi kesalahan saat login",
      });
    }
  }, [dispatch, email, password, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md bg-base-100 shadow-xl rounded-2xl p-8 border border-base-300"
      >
        <h2 className="text-3xl font-bold text-center text-primary mb-2">Login</h2>
        <p className="text-center text-base-content/70 mb-6">
          Masuk ke akun admin Anda
        </p>

        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="input input-bordered w-full"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="input input-bordered w-full pr-10"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/70 hover:text-primary"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox checkbox-sm" />
              Ingat saya
            </label>
            <a href="/forgot-password" className="link link-hover text-primary">
              Lupa Password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? "Memuat..." : "Login"}
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

export default LoginPage;
