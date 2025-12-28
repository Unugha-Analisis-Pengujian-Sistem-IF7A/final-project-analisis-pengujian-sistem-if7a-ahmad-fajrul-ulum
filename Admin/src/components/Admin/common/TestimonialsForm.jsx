import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  addTestimonial,
  editTestimonial,
} from "../../../app/data/testimoniSlice";

const FormTestimonials = ({ open, onClose, testimonial, onSuccess }) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    author: "",
    position: "",
    content: "",
    rating: 5,
    avatar: null,
  });

  const [preview, setPreview] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData({
        author: testimonial.author || "",
        position: testimonial.position || "",
        content: testimonial.content || "",
        rating: testimonial.rating || 5,
        avatar: null,
      });
      setPreview(testimonial.testimoniImage || null);
    } else {
      setFormData({
        author: "",
        position: "",
        content: "",
        rating: 5,
        avatar: null,
      });
      setPreview(null);
    }
    setRemoveImage(false);
  }, [testimonial]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreview(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    setFormData((prev) => ({ ...prev, avatar: null }));
    setRemoveImage(true);
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSend = new FormData();
    dataToSend.append("author", formData.author);
    dataToSend.append("position", formData.position);
    dataToSend.append("content", formData.content);
    dataToSend.append("rating", formData.rating);

    if (formData.avatar) {
      dataToSend.append("testimoniImage", formData.avatar);
    }

    if (removeImage) {
      dataToSend.append("removeImage", "true");
    }

    try {
      if (testimonial) {
        await dispatch(
          editTestimonial({ id: testimonial._id, formData: dataToSend })
        ).unwrap();
      } else {
        await dispatch(addTestimonial(dataToSend)).unwrap();
      }

      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Gagal submit testimonial:", error);
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
              {testimonial ? "Edit Testimonial" : "Tambah Testimonial"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-lg cursor-pointer"
            >
              <FaRegTimesCircle />
            </button>
          </div>

          {/* Avatar Image */}
          <div>
            <label className="label">
              <span className="label-text">Foto (opsional)</span>
            </label>
            {preview && (
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="rounded-full w-24 h-24 object-cover border"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="btn btn-sm btn-outline btn-error"
                >
                  <FaRegTimesCircle className="mr-2" />
                  Hapus Gambar
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="file-input file-input-bordered w-full"
              onChange={handleImageChange}
            />
          </div>

          {/* Author */}
          <div>
            <label className="label" htmlFor="author">
              <span className="label-text">Nama</span>
            </label>
            <input
              id="author"
              type="text"
              className="input input-bordered w-full"
              placeholder="Nama orang yang memberikan testimonial"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            />
          </div>

          {/* Position */}
          <div>
            <label className="label" htmlFor="position">
              <span className="label-text">Posisi / Jabatan</span>
            </label>
            <input
              id="position"
              type="text"
              className="input input-bordered w-full"
              placeholder="Misalnya: CEO PT ABC"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
            />
          </div>

          {/* Content */}
          <div>
            <label className="label" htmlFor="testimonialContent">
              <span className="label-text">Isi Testimonial</span>
            </label>
            <textarea
              id="testimonialContent"
              className="textarea textarea-bordered w-full min-h-[100px]"
              placeholder="Tulis testimonial di sini..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>

          {/* Rating */}
          <div>
            <label className="label">
              <span className="label-text">Rating</span>
            </label>
            <div className="rating">
              {[1, 2, 3, 4, 5].map((val) => (
                <input
                  key={val}
                  type="radio"
                  name="rating"
                  className="mask mask-star-2 bg-yellow-400"
                  checked={formData.rating === val}
                  onChange={() =>
                    setFormData({ ...formData, rating: val })
                  }
                />
              ))}
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
              {loading ? "Menyimpan..." : testimonial ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </dialog>
  );
};

export default FormTestimonials;

FormTestimonials.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  testimonial: PropTypes.shape({
    _id: PropTypes.string,
    author: PropTypes.string,
    position: PropTypes.string,
    content: PropTypes.string,
    rating: PropTypes.number,
    testimoniImage: PropTypes.string,
  }),
  onSuccess: PropTypes.func,
};
