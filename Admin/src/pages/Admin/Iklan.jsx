import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchIklan, removeIklan } from "../../app/data/iklanSlice";
import IklanForm from "../../components/Admin/common/IklanForm";
import Toast from "../../components/Admin/common/Toast";
import ConfirmDeleteModal from "../../components/Admin/common/ConfirmDeleteModal";

const Iklan = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedIklan, setSelectedIklan] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [iklanToDelete, setIklanToDelete] = useState(null);

  const { iklan, isLoading, error } = useSelector((state) => state.iklan);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIklan());
  }, [dispatch]);

  const handleEdit = (iklan) => {
    setSelectedIklan(iklan);
    setOpenForm(true);
  };

  const handleDelete = (iklan) => {
    setIklanToDelete(iklan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (iklanToDelete) {
      try {
        await dispatch(removeIklan(iklanToDelete._id)).unwrap();
        setToast({ type: "success", message: "Iklan berhasil dihapus" });
        dispatch(fetchIklan());
      } catch (error) {
        setToast({ type: "error", message: "Gagal menghapus iklan" });
      }
    }
    setIsDeleteModalOpen(false);
    setIklanToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setIklanToDelete(null);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Manajemen Iklan
        </h1>
        <button
          onClick={() => {
            setSelectedIklan(null);
            setOpenForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          + Tambah Iklan
        </button>
      </div>

      {/* Konten */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-10">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {iklan?.map((item) => (
            <div
              key={item._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={item.iklanImage}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Status:{" "}
                    <span className={item.isActive ? "text-green-600" : "text-red-500"}>
                      {item.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 px-3 py-1 text-sm border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:text-white rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item)}
                    className="flex-1 px-3 py-1 text-sm border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-600 dark:hover:text-white rounded transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <IklanForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedIklan(null);
        }}
        iklan={selectedIklan}
        setToast={setToast}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        itemTitle={iklanToDelete?.title}
        itemType="iklan"
      />
    </div>
  );
};

export default Iklan;
