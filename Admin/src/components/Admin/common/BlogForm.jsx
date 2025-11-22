/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  createNewBlog,
  fetchBlogs,
  updateExistingBlog,
} from "../../../app/data/blogSlice";

const BlogForm = ({ open, onClose, blog, setToast }) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    blogImage: "",
    status: "draft",
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        blogImage: blog.blogImage,
        status: blog.status,
      });
    } else {
      setFormData({ title: "", content: "", blogImage: "", status: "draft" });
    }
    setImageFile(null);
  }, [blog]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setFormData((prev) => ({ ...prev, blogImage: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("status", formData.status);

      if (imageFile) {
        payload.append("blogImage", imageFile);
      } else if (formData.blogImage) {
        payload.append("blogImage", formData.blogImage);
      }

      if (blog) {
        await dispatch(
          updateExistingBlog({ id: blog._id, formData: payload })
        ).unwrap();
        setToast({ type: "success", message: "Blog berhasil diupdate!" });
      } else {
        await dispatch(createNewBlog(payload)).unwrap();
        setToast({ type: "success", message: "Blog berhasil ditambahkan!" });
      }
      dispatch(fetchBlogs());
      onClose();
    } catch (err) {
      console.error(err);
      setToast({
        type: "error",
        message: blog ? "Gagal mengupdate blog." : "Gagal menambahkan blog.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="modal-box max-w-3xl w-full"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold">
              {blog ? "Edit Blog" : "Tambah Blog Baru"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-lg cursor-pointer"
            >
              <FaRegTimesCircle />
            </button>
          </div>

          {/* Judul */}
          <div>
            <label className="label">
              <span className="label-text">Judul</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="Masukkan judul blog"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          {/* Konten */}
          <div>
            <label className="label">
              <span className="label-text">Konten</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full min-h-[120px]"
              placeholder="Tulis konten blog di sini. Gunakan *italic*, **bold**, [teks](https://...) untuk styling."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            ></textarea>
            <div className="text-sm text-gray-500 mt-2">
              Gunakan:
              <ul className="list-disc list-inside ml-2">
                <li>
                  <code>*italic*</code> → <em>italic</em>
                </li>
                <li>
                  <code>**bold**</code> → <strong>bold</strong>
                </li>
                <li>
                  <code>[teks](https://example.com)</code> →{" "}
                  <a
                    href="https://example.com"
                    className="text-blue-400 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    teks
                  </a>
                </li>
                <li>
                  <code>```</code> untuk memulai/menutup blok kode
                </li>
              </ul>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="draft">Draft</option>
              <option value="publish">Publish</option>
            </select>
          </div>

          {/* Blog Image */}
          <div>
            <label className="label">
              <span className="label-text">URL Gambar Blog (opsional)</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              placeholder="https://example.com/image.jpg"
              value={formData.blogImage}
              onChange={(e) =>
                setFormData({ ...formData, blogImage: e.target.value })
              }
              disabled={imageFile}
            />
            <div className="mt-2">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="file-input file-input-bordered w-full"
                onChange={handleImageChange}
              />
              {imageFile && (
                <p className="text-sm mt-1 text-green-600">
                  File dipilih: {imageFile.name}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action justify-between">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Menyimpan..." : blog ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </dialog>
  );
};

export default BlogForm;
