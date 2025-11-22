import { FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getMe, logout } from "../../app/users/authSlice";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false); // State untuk modal konfirmasi logout
  const menuRef = useRef(null); // Ref untuk menu dropdown
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading } = useSelector((state) => state.auth); // Mengambil data user dan status loading

  useEffect(() => {
    if (!user) {
      dispatch(getMe()); // Hanya ambil data jika user belum ada
    }
  }, [dispatch, user]);

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  // Close menu when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false); // Tutup menu jika klik di luar
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside); // Cleanup
    };
  }, [menuOpen]);

  if (isLoading) {
    return <div>Loading...</div>; // Menunggu data pengguna dimuat
  }

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-base-100 border-b border-base-300"
    >
        <div className="px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-primary">
            Xeranet Solutions Technology
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 relative">
          {/* Avatar + Menu */}
          {user && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 btn btn-ghost px-2 py-1 rounded-full transition-all"
              >
                <img
                  src={user?.imgProfile || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2"
                />
                <FaChevronDown className="text-xs" />
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -5, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -5, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 bg-base-100 border border-base-300 shadow-md rounded-lg min-w-[10rem] w-screen max-w-xs py-2 z-50"
                  >
                    <li>
                      <Link
                        to="/admin/profile" // Tidak perlu menggunakan state untuk user, cukup rute saja
                        className="block px-4 py-2 hover:bg-base-200"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/admin/manage-users"
                        className="block px-4 py-2 hover:bg-base-200"
                      >
                        Manage Users
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={openLogoutModal} // Membuka modal konfirmasi logout
                        className="w-full text-left px-4 py-2 hover:bg-base-200 text-error"
                      >
                        Logout
                      </button>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modal Konfirmasi Logout */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Konfirmasi Logout</h3>
            <p>Apakah Anda yakin ingin logout?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeLogoutModal} // Menutup modal jika dibatalkan
                className="btn btn-ghost"
              >
                Batal
              </button>
              <button
                onClick={handleLogout} // Melanjutkan logout
                className="btn btn-primary"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
};

export default Header;
