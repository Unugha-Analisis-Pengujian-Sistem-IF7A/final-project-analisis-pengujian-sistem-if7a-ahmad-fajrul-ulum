import { useEffect } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addLogoPT, editLogoPT } from "../../../app/data/logoPTSlice";
import { motion } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";

const LogoPTForm = ({ open, onClose, logo }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();

  const dispatch = useDispatch();

  useEffect(() => {
    if (logo) {
      reset({
        namaPT: logo.title || "",
        logoImage: null,
      });
    } else {
      reset({ namaPT: "", logoImage: null });
    }
  }, [logo, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append("title", data.namaPT);
    if (data.logoImage?.[0]) {
      formData.append("logoPTImage", data.logoImage[0]);
    }

    try {
      if (logo) {
        await dispatch(editLogoPT({ id: logo._id, formData })).unwrap();
      } else {
        await dispatch(addLogoPT(formData)).unwrap();
      }

      onClose();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {logo ? "Edit Logo PT" : "Tambah Logo PT"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-lg"
          >
            <FaRegTimesCircle />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="label" htmlFor="namaPT">Nama PT</label>
            <input
              id="namaPT"
              type="text"
              className="input input-bordered w-full"
              {...register("namaPT", { required: true })}
            />
          </div>

          <div>
            <label className="label" htmlFor="logoImage">Logo</label>
            <input
              id="logoImage"
              type="file"
              className="file-input file-input-bordered w-full"
              {...register("logoImage")}
            />
            {logo?.logoPTImage && (
              <img
                src={logo.logoPTImage}
                alt="Preview"
                className="mt-2 h-24 object-contain"
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
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
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </dialog>
  );
};

LogoPTForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  logo: PropTypes.shape({
    _id: PropTypes.string,
    title: PropTypes.string,
    logoPTImage: PropTypes.string,
  }),
};

export default LogoPTForm;
