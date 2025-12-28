import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteExistingBlog } from "../../app/data/blogSlice";
import BlogForm from "../../components/Admin/common/BlogForm";
import Toast from "../../components/Admin/common/Toast";
import ConfirmDeleteModal from "../../components/Admin/common/ConfirmDeleteModal";
import { FaEdit, FaTrash } from "react-icons/fa";

const Blog = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  const { blogs, isLoading } = useSelector((state) => state.blog);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setOpenForm(true);
  };

  const handleDelete = (blog) => {
    setBlogToDelete(blog);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (blogToDelete) {
      try {
        await dispatch(deleteExistingBlog(blogToDelete._id)).unwrap();
        setToast({ type: "success", message: "Blog berhasil dihapus" });
        dispatch(fetchBlogs());
      } catch (err) {
        console.error(err);
        setToast({ type: "error", message: "Gagal menghapus blog" });
      }
    }
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setBlogToDelete(null);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Kelola Blog
        </h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          onClick={() => {
            setSelectedBlog(null);
            setOpenForm(true);
          }}
        >
          + Tambah Blog
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-10">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs?.map((blog) => (
            <div
              key={blog._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={blog.blogImage}
                alt={blog.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center mt-2 space-x-2">
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${blog.status === "published"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-600"
                        }`}
                    >
                      {blog.status}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(blog.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="flex-1 px-3 py-1 text-sm border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:text-white rounded transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(blog)}
                    className="flex-1 px-3 py-1 text-sm border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-600 dark:hover:text-white rounded transition"
                    data-testid="delete-blog-btn"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blog Form */}
      {openForm && (
        <BlogForm
          open={openForm}
          onClose={() => {
            setOpenForm(false);
            setSelectedBlog(null);
          }}
          blog={selectedBlog}
          setToast={setToast}
        />
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        itemTitle={blogToDelete?.title}
        itemType="blog"
      />
    </div>
  );
};

export default Blog;
