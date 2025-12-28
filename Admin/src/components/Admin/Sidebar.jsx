import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  MdDashboard,
  MdArticle,
  MdStars,
  MdImage,
  MdBadge,
} from "react-icons/md";
import { FaTags } from "react-icons/fa";
import { useSelector } from "react-redux";

const menuItems = [
  { text: "Dashboard", icon: <MdDashboard size={22} />, path: "/admin/dashboard" },
  { text: "Blog", icon: <MdArticle size={22} />, path: "/admin/blog" },
  { text: "Testimonials", icon: <MdStars size={22} />, path: "/admin/testimonials" },
  { text: "Hero Background", icon: <MdImage size={22} />, path: "/admin/hero" },
  { text: "Iklan", icon: <FaTags size={22} />, path: "/admin/iklan" },
  { text: "Logo Partner", icon: <MdBadge size={22} />, path: "/admin/logo-partner" },
];

import PropTypes from "prop-types";

const Sidebar = ({ children }) => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: 260 }}
        transition={{ duration: 0.3 }}
        className="h-screen w-[260px] fixed top-0 left-0 bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-600 shadow-lg z-50 flex flex-col"
      >
        {/* Profile */}
        <div className="p-6 pb-4 border-b border-white/20 flex flex-col items-center space-y-4">
          <img
            src={user?.imgProfile || "/default-avatar.png"}
            alt="Avatar"
            className="w-20 h-20 rounded-full ring-4 ring-white ring-offset-2 transition duration-300 hover:ring-offset-4"
          />
          <div className="text-center text-white">
            <p className="text-lg font-semibold">{user?.name || "Admin"}</p>
            <p className="text-xs opacity-80">{user?.email || "admin@example.com"}</p>
          </div>
        </div>

        {/* Menu */}
        <ul className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {menuItems.map(({ text, icon, path }) => (
            <li key={text}>
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-4 py-3 rounded-md transition-all duration-200 ${isActive
                    ? "bg-white/20 text-white shadow-md"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <span>{icon}</span>
                <span className="text-sm font-medium">{text}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="p-4 text-xs text-white/60 border-t border-white/20 text-center">
          &copy; 2025 Xeranet Solutions Technology
        </div>
      </motion.aside>

      {/* Konten utama */}
      <main className="ml-[230px] w-full min-h-screen bg-base-100 p-6">
        {children}
      </main>
    </div>
  );
};

Sidebar.propTypes = {
  children: PropTypes.node,
};

export default Sidebar;
