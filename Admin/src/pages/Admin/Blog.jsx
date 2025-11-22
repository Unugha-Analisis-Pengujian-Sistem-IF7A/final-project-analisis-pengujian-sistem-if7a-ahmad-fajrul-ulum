import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogs,
  deleteExistingBlog,
  updateExistingBlog,
} from "../../app/data/blogSlice";
import BlogForm from "../../components/Admin/common/BlogForm";
import Toast from "../../components/Admin/common/Toast";
import ConfirmDeleteModal from "../../components/Admin/common/ConfirmDeleteModal";
import moment from "moment";

const Blog = () => {
  const dispatch = useDispatch();
  const { blogs, isLoading } = useSelector((state) => state.blog);

  const [openForm, setOpenForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("newest");

  const blogsPerPage = 5;

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedBlog(null);
    setOpenForm(true);
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setOpenForm(true);
  };

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;

    try {
      await dispatch(deleteExistingBlog(blogToDelete._id)).unwrap();
      setToast({ type: "success", message: "Blog berhasil dihapus" });
      dispatch(fetchBlogs());
    } catch {
      setToast({ type: "error", message: "Gagal menghapus blog" });
    }

    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const handleToggleStatus = async (blog) => {
    const newStatus = blog.status === "published" ? "draft" : "published";

    try {
      await dispatch(
        updateExistingBlog({
          id: blog._id,
          FormData: {
            title: blog.title,
            content: blog.content,
            status: newStatus,
          },
        })
      ).unwrap();

      setToast({ type: "success", message: "Status blog diperbarui" });
      dispatch(fetchBlogs());
    } catch {
      setToast({ type: "error", message: "Gagal memperbarui status" });
    }
  };

  const sortedBlogs = [...blogs].sort((a, b) => {
    if (sortBy === "az") return a.title.localeCompare(b.title);
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = sortedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="p-6 md:p-10 space-y-6">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          Kelola Blog
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
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow text-sm transition"
          >
            Tambah Blog
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
        <table className="min-w-full table-fixed text-sm divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white">
            <tr>
              <th className="px-4 py-2 text-left w-1/3">Judul</th>
              <th className="px-4 py-2 text-left w-1/6">Status</th>
              <th className="px-4 py-2 text-left w-1/6">Terakhir Diupdate</th>
              <th className="px-4 py-2 text-left w-1/4">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {currentBlogs.map((blog) => (
              <tr
                key={blog._id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                <td className="px-4 py-2 text-gray-800 dark:text-white text-left">
                  <div className="break-words max-w-full">
                    {blog.title.length > 50
                      ? blog.title.slice(0, 50) + "..."
                      : blog.title}
                  </div>
                </td>
                <td className="px-4 py-2 text-left">
                  <button
                    onClick={() => handleToggleStatus(blog)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                      blog.status === "published"
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-black"
                    }`}
                  >
                    {blog.status}
                  </button>
                </td>
                <td className="px-4 py-2 text-left text-gray-600 dark:text-gray-300">
                  {moment(blog.updatedAt).format("DD MMM YYYY, HH:mm")}
                </td>
                <td className="px-4 py-2 text-left">
                  <div className="flex justify-start gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex items-center gap-1 px-3 py-1 border border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white rounded-md text-xs transition"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(blog)}
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
      </div>

      {/* Pagination */}
      {blogs.length > blogsPerPage && (
        <div className="flex justify-center mt-4 gap-4 items-center">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 transition"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700 dark:text-white">
            Page {currentPage}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * blogsPerPage >= blogs.length}
            className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:bg-gray-300 transition"
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
      <BlogForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        blog={selectedBlog}
        setToast={setToast}
      />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        blogTitle={blogToDelete?.title}
      />
    </div>
  );
};

export default Blog;
