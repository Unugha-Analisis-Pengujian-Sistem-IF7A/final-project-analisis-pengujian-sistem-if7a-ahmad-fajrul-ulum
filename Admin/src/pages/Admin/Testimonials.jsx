import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import {
  fetchTestimonials,
  removeTestimonial,
} from "../../app/data/testimoniSlice";
import TestimonialForm from "../../components/Admin/common/TestimonialsForm";
import ConfirmDeleteModal from "../../components/Admin/common/ConfirmDeleteModal";
import Toast from "../../components/Admin/common/Toast";

const Testimonials = () => {
  const dispatch = useDispatch();
  const { testimonials = [], isLoading } = useSelector(
    (state) => state.testimonials || {}
  );

  const [openForm, setOpenForm] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const testimonialsPerPage = 5;

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedTestimonial(null);
    setOpenForm(true);
  };

  const handleEdit = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setOpenForm(true);
  };

  const handleDelete = (testimonial) => {
    setTestimonialToDelete(testimonial);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!testimonialToDelete) return;

    try {
      await dispatch(removeTestimonial(testimonialToDelete._id)).unwrap();
      setToast({ type: "success", message: "Testimonial berhasil dihapus" });
      dispatch(fetchTestimonials());
    } catch {
      setToast({ type: "error", message: "Gagal menghapus testimonial" });
    }

    setIsDeleteModalOpen(false);
    setTestimonialToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setTestimonialToDelete(null);
  };

  const sortedTestimonials = [...testimonials].sort((a, b) => {
    if (sortBy === "az") return a.author.localeCompare(b.author);
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const indexOfLast = currentPage * testimonialsPerPage;
  const indexOfFirst = indexOfLast - testimonialsPerPage;
  const currentTestimonials = sortedTestimonials.slice(indexOfFirst, indexOfLast);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Kelola Testimonial
        </h1>
        <div className="flex gap-4 items-center">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-md text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600"
          >
            <option value="newest">Terbaru</option>
            <option value="az">A-Z</option>
          </select>
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow text-sm md:text-base transition"
          >
            Tambah Testimonial
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        {testimonials.length === 0 ? (
          <div className="text-center text-gray-600 dark:text-gray-300 py-10">
            Tidak ada testimonial untuk ditampilkan.
          </div>
        ) : (
          <table className="min-w-full table-auto text-sm md:text-base divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
              <tr>
                <th className="px-4 py-2 text-left font-medium w-1/4">Nama</th>
                <th className="px-4 py-2 text-left font-medium w-1/6">Rating</th>
                <th className="px-4 py-2 text-left font-medium">Terakhir Diupdate</th>
                <th className="px-4 py-2 text-left font-medium w-1/4">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentTestimonials.map((testimonial) => (
                <tr
                  key={testimonial._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <td className="px-4 py-2 text-gray-800 dark:text-white text-left">
                    <div className="flex items-center gap-3">
                      <img
  src={testimonial.testimoniImage || "https://via.placeholder.com/40"}
  alt={testimonial.author}
  className="w-10 h-10 rounded-full object-cover"
/>

                      <span>{testimonial.author}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300 text-left">
                    {testimonial.rating}/5
                  </td>
                  <td className="px-4 py-2 text-gray-600 dark:text-gray-300 text-left">
                    {moment(testimonial.updatedAt).format("DD MMM YYYY, HH:mm")}
                  </td>
                  <td className="px-4 py-2 text-left">
                    <div className="flex justify-start gap-2">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="flex items-center gap-1 px-3 py-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md text-xs transition"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(testimonial)}
                        className="flex items-center gap-1 px-3 py-1 border border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-md text-xs transition"
                      >
                        <FaTrash /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {testimonials.length > testimonialsPerPage && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 transition"
          >
            Previous
          </button>
          <span className="mx-4 text-sm text-gray-700 dark:text-white">
            Page {currentPage}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * testimonialsPerPage >= testimonials.length}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <TestimonialForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        setToast={setToast}
        testimonial={selectedTestimonial}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        testimonialName={testimonialToDelete?.author}
      />
    </div>
  );
};

export default Testimonials;
