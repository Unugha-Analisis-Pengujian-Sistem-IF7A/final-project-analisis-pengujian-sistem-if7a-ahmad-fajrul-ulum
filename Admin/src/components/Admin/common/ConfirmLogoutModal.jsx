import { motion } from "framer-motion";
import { FaRegTimesCircle } from "react-icons/fa";
import PropTypes from "prop-types";

const ConfirmLogoutModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <dialog
      className={`modal modal-open bg-black/30 backdrop-blur-sm`}
      onClick={onCancel} // NOSONAR - Dialog is interactive, backdrop click to close is standard UX
      onKeyDown={(e) => { if (e.key === 'Escape') onCancel(); }} // NOSONAR - Escape key handler for accessibility
      data-testid="logout-modal-backdrop"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className="modal-box max-w-lg w-full"
        onClick={(e) => e.stopPropagation()} // mencegah klik di dalam modal menutup
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Konfirmasi Logout</h3>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-red-500 text-lg"
          >
            <FaRegTimesCircle />
          </button>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Apakah Anda yakin ingin <span className="font-semibold text-red-600">logout</span> dari akun ini?
          </p>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-ghost"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-primary"
          >
            Logout
          </button>
        </div>
      </motion.div>
    </dialog>
  );
};

ConfirmLogoutModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ConfirmLogoutModal;
