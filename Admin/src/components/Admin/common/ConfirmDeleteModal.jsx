import { motion } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const ConfirmDeleteModal = ({ isOpen, onCancel, onConfirm, blogTitle }) => {
  if (!isOpen) return null;

  return (
    <dialog
      className={`modal ${isOpen ? "modal-open" : ""}`}
      onClick={onCancel} // NOSONAR - Dialog is interactive, backdrop click to close is standard UX
      onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }} // NOSONAR - Escape key handler for accessibility
      data-testid="delete-modal-backdrop"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="modal-box max-w-sm w-full bg-white rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing if clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">Konfirmasi Penghapusan</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-red-500 text-lg cursor-pointer"
          >
            <FaRegTimesCircle />
          </button>
        </div>
        <p className="mb-4 text-gray-700">Apakah Anda yakin ingin menghapus {blogTitle || "item ini"}?</p>

        <div className="flex justify-between mt-4">
          <button
            onClick={onCancel}
            className="btn btn-ghost bg-gray-200 hover:bg-gray-300 text-gray-700"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="btn btn-error bg-red-500 hover:bg-red-600 text-white"
          >
            Hapus
          </button>
        </div>
      </motion.div>
    </dialog>
  );
};

ConfirmDeleteModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  blogTitle: PropTypes.string,
};

export default ConfirmDeleteModal;
