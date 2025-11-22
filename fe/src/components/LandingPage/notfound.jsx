import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-[#1a1a1a] text-white min-h-screen flex flex-col items-center justify-center px-6 py-16 relative"
      style={{ fontFamily: "Inter" }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="text-7xl font-extrabold mb-6 text-center text-red-500"
      >
        404
      </motion.h1>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="text-lg text-gray-400 text-center mb-6 max-w-lg"
      >
        Maaf, halaman yang Anda cari tidak ditemukan. Halaman mungkin telah dihapus atau tidak tersedia.
      </motion.p>

      {/* Back to Home Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <Link
          to="/"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-all duration-300"
        >
          Kembali ke Beranda
        </Link>
      </motion.div>

      {/* Footer Line */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="absolute bottom-10 w-full text-center"
      >
        <div className="relative inline-block">
          <div className="absolute inset-0 border-t border-gray-700"></div>
          <span className="relative text-sm text-gray-500 px-4 bg-[#1a1a1a]">
            404 Error
          </span>
        </div>
      </motion.div>

      {/* Background Decoration */}
      <motion.div
        initial={{ opacity: 0.2 }}
        animate={{ opacity: 0.1 }}
        transition={{ delay: 0.7, duration: 2 }}
        className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-[#333] opacity-20 pointer-events-none"
      ></motion.div>
    </motion.div>
  );
};

export default NotFound;
