import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addHero, editHero, fetchHeroes } from "../../../app/data/heroSlice";
import { motion } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";

const HeroForm = ({ open, onClose, hero }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    if (hero) {
      setValue("title", hero.title);
      setValue("isActive", hero.isActive);
      setValue("heroImage", hero.heroImage || "");
    } else {
      reset();
    }
  }, [hero, setValue, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("isActive", data.isActive);
    formData.append("createdBy", "admin");

    if (data.heroImageFile?.[0]) {
      formData.append("heroImage", data.heroImageFile[0]);
    } else if (data.heroImage) {
      formData.append("heroImage", data.heroImage);
    }

    try {
      if (hero) {
        await dispatch(editHero({ id: hero._id, formData })).unwrap();
      } else {
        await dispatch(addHero(formData)).unwrap();
      }

      dispatch(fetchHeroes());
      onClose();
      reset();
    } catch (error) {
      console.error("Gagal menyimpan hero:", error);
    }
  };

  if (!open) return null;

  return (
    <dialog className={`modal ${open ? "modal-open" : ""}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="modal-box max-w-lg w-full"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {hero ? "Edit Hero" : "Tambah Hero"}
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-red-500 text-lg"
            >
              <FaRegTimesCircle />
            </button>
          </div>

          <div>
            <label className="label">Judul</label>
            <input
              type="text"
              {...register("title", { required: true })}
              className="input input-bordered w-full"
              placeholder="Judul hero"
            />
          </div>

          <div>
            <label className="label">Upload Gambar Hero</label>
            <input
              type="file"
              accept="image/*"
              {...register("heroImageFile")}
              className="file-input file-input-bordered w-full"
            />
          </div>

          <div>
            <label className="label">Atau Gunakan URL Gambar</label>
            <input
              type="text"
              {...register("heroImage")}
              className="input input-bordered w-full"
              placeholder="https://contoh.com/gambar.jpg"
            />
          </div>

          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-2">
              <input
                type="checkbox"
                {...register("isActive")}
                className="checkbox checkbox-primary"
              />
              <span className="label-text">Aktifkan Hero Ini</span>
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                reset();
              }}
              className="btn btn-ghost"
              disabled={isSubmitting}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? hero
                  ? "Menyimpan..."
                  : "Menambahkan..."
                : hero
                ? "Simpan Perubahan"
                : "Tambah Hero"}
            </button>
          </div>
        </form>
      </motion.div>
    </dialog>
  );
};

export default HeroForm;
