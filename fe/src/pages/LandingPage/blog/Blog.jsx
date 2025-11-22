import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs } from "../../../app/data/blogSlice.js";

const Blog = () => {
  const { blogs, isLoading } = useSelector((state) => state.blog);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const renderCleanPreviewText = (content) => {
    const cleanText = content
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, "$1")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/<[^>]+>/g, "")
      .slice(0, 130);
    return cleanText + "...";
  };

  const publishedBlogs = blogs.filter((post) => post.status === "publish");
  const totalPages = Math.ceil(publishedBlogs.length / postsPerPage);
  const currentPosts = publishedBlogs.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <section className="min-h-screen bg-gradient-to-b from-black via-[#1a0000] to-black text-white pt-28 pb-14 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-bold mb-12 text-center"
        >
          Artikel Terbaru
        </motion.h1>

        <div className="space-y-10">
          {currentPosts.map((post, index) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5 sm:p-6 shadow-sm hover:shadow-red-800/10 transition"
            >
              <p className="text-xs text-gray-400 mb-1">
                {new Date(post.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <Link to={`/blog/${post._id}`}>
                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-white hover:text-red-400 transition">
                  {post.title}
                </h2>
              </Link>
              <p className="text-gray-300 text-sm sm:text-base mb-3">
                {renderCleanPreviewText(post.content)}
              </p>
              <Link
                to={`/blog/${post._id}`}
                className="text-red-400 text-sm hover:underline"
              >
                Baca Selengkapnya →
              </Link>
            </motion.article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-white/20 rounded hover:bg-white/10 disabled:opacity-30"
            >
              ← Sebelumnya
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-white/20 rounded hover:bg-white/10 disabled:opacity-30"
            >
              Selanjutnya →
            </button>
          </div>
        )}

        {isLoading && (
          <div className="text-center text-gray-400 mt-12">Memuat blog...</div>
        )}
        {!isLoading && publishedBlogs.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            Belum ada blog yang tersedia.
          </div>
        )}
      </div>
    </section>
  );
};

export default Blog;
