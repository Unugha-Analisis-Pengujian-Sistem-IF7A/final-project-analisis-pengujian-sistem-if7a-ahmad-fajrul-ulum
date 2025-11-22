import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Edit2 } from "lucide-react";

import EditProfileForm from "../../components/Admin/common/EditProfileForm";
import { getMe } from "../../app/users/authSlice";

const ProfilePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user: reduxUser, loading: authLoading } = useSelector(
    (state) => state.auth
  );

  const userFromState = location.state?.user;
  const user = userFromState || reduxUser;

  useEffect(() => {
    if (!reduxUser) {
      dispatch(getMe());
    }
  }, [dispatch, reduxUser]);

  useEffect(() => {
    if (!authLoading && !userFromState && !reduxUser) {
      navigate("/admin/login");
    }
  }, [userFromState, reduxUser, authLoading, navigate]);

  const handleEdit = () => {
    setSelectedProfile(user);
    setIsOpen(true);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-medium text-gray-600">
          User tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mx-auto px-6 sm:px-8 py-16"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-center">
        {/* Tombol Edit di pojok kanan atas */}
        <button
          onClick={handleEdit}
          className="absolute top-4 right-4 inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary-dark transition"
        >
          <Edit2 size={16} />
          Edit Profil
        </button>

        {/* Avatar */}
        <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-primary ring-offset-2 shadow-md">
          <img
            src={user?.imgProfile || "/default-avatar.png"}
            alt="Foto Profil"
            className="object-cover w-full h-full"
            onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
          />
        </div>

        {/* Info */}
        <div className="flex flex-col text-left gap-1">
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.fullName || "Admin"}
          </h1>

          {/* Role Badge */}
          <span
            className={`w-fit text-xs font-semibold px-3 py-1 rounded-full
            ${
              user?.role === "admin"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-600"
            }`}
          >
            {user?.role === "admin" ? "Admin" : "Users"}
          </span>

          {/* Username & Email */}
          <p className="text-sm text-gray-600">@{user?.username || "username"}</p>
          <p className="text-sm text-gray-500">{user?.email || "email@example.com"}</p>
        </div>
      </div>

      {isOpen && user && (
        <EditProfileForm
          open={isOpen}
          onClose={() => setIsOpen(false)}
          profile={selectedProfile}
        />
      )}
    </motion.div>
  );
};

export default ProfilePage;
