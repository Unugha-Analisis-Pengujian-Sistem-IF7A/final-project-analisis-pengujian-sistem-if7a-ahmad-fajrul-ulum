import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogoPTs, removeLogoPT } from "../../app/data/logoPTSlice";
import LogoPTForm from "../../components/Admin/common/LogoPtForm";
import Toast from "../../components/Admin/common/Toast";
import ConfirmDeleteModal from "../../components/Admin/common/ConfirmDeleteModal";

const LogoPT = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedLogo, setSelectedLogo] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [logoToDelete, setLogoToDelete] = useState(null);

  const { logoPTs, isLoading, error } = useSelector((state) => state.logoPTs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchLogoPTs());
  }, [dispatch]);

  const handleEdit = (logo) => {
    setSelectedLogo(logo);
    setOpenForm(true);
  };

  const handleDelete = (logo) => {
    setLogoToDelete(logo);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (logoToDelete) {
      try {
        await dispatch(removeLogoPT(logoToDelete._id)).unwrap();
        setToast({ type: "success", message: "Logo berhasil dihapus" });
        dispatch(fetchLogoPTs());
      } catch (err) {
        console.error(err);
        setToast({ type: "error", message: "Gagal menghapus logo" });
      }
    }
    setIsDeleteModalOpen(false);
    setLogoToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setLogoToDelete(null);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen space-y-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Logo PT</h1>
        <button
          onClick={() => {
            setSelectedLogo(null);
            setOpenForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition duration-200"
        >
          + Tambah Logo
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-10">Memuat data...</div>
      ) : error ? (
        <div className="text-red-500">Gagal memuat data: {error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {logoPTs?.map((logo) => (
            <div
              key={logo._id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between"
            >
              <div className="flex justify-center">
                <img
                  src={logo.logoPTImage}
                  alt={logo.namaPT}
                  className="h-24 object-contain"
                />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {logo.namaPT}
                </h3>
              </div>
              <div className="flex justify-center mt-4 gap-3">
                <button
                  onClick={() => handleEdit(logo)}
                  className="px-4 py-1 text-sm border border-blue-500 text-blue-600 rounded hover:bg-blue-50 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(logo)}
                  className="px-4 py-1 text-sm border border-red-500 text-red-600 rounded hover:bg-red-50 transition"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      <LogoPTForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedLogo(null);
        }}
        logo={selectedLogo}
        setToast={setToast}
      />

      {/* Modal Konfirmasi Hapus */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        itemTitle={logoToDelete?.namaPT}
        itemType="logo PT"
      />
    </div>
  );
};

export default LogoPT;
