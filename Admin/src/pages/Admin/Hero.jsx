import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchHeroes, removeHero } from "../../app/data/heroSlice";
import HeroForm from "../../components/Admin/common/heroForm";
import Toast from "../../components/Admin/common/Toast";
import ConfirmDeleteModal from "../../components/Admin/common/ConfirmDeleteModal";

const Hero = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedHero, setSelectedHero] = useState(null);
  const [toast, setToast] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [heroToDelete, setHeroToDelete] = useState(null);

  const { heroes, isLoading, error } = useSelector((state) => state.hero);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchHeroes());
  }, [dispatch]);

  const handleEdit = (hero) => {
    setSelectedHero(hero);
    setOpenForm(true);
  };

  const handleDelete = (hero) => {
    setHeroToDelete(hero);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (heroToDelete) {
      try {
        await dispatch(removeHero(heroToDelete._id)).unwrap();
        setToast({ type: "success", message: "Hero berhasil dihapus" });
        dispatch(fetchHeroes());
      } catch (error) {
        setToast({ type: "error", message: "Gagal menghapus hero" });
      }
    }
    setIsDeleteModalOpen(false);
    setHeroToDelete(null);
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setHeroToDelete(null);
  };

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen space-y-8">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      {error && <div className="text-red-500">Error: {error}</div>}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Kelola Hero
        </h1>
        <button
          onClick={() => {
            setSelectedHero(null);
            setOpenForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          + Tambah Hero
        </button>
      </div>

      {/* Hero Cards or Empty State */}
      {isLoading ? (
        <div className="text-center text-gray-500 py-10">Memuat data...</div>
      ) : heroes?.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          Tidak ada hero yang tersedia.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {heroes?.map((hero) => (
            <div
              key={hero._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
            >
              <img
                src={hero.heroImage}
                alt={hero.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                    {hero.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Status:{" "}
                    <span
                      className={
                        hero.isActive
                          ? "text-green-600"
                          : "text-red-500"
                      }
                    >
                      {hero.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(hero)}
                    className="flex-1 px-3 py-1 text-sm border border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600 dark:hover:text-white rounded transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hero)}
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

      {/* Hero Form Modal */}
      <HeroForm
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedHero(null);
        }}
        hero={selectedHero}
        setToast={setToast}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        itemTitle={heroToDelete?.title}
        itemType="hero"
      />
    </div>
  );
};

export default Hero;
