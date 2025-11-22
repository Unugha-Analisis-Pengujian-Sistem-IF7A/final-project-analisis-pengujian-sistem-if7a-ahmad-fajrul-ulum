import { useEffect } from "react";

const Toast = ({ type = "success", message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertClass = {
    success: "alert-success",
    error: "alert-error",
    warning: "alert-warning",
    info: "alert-info",
  };

  return (
    <div className="toast toast-top toast-end z-50">
      <div className={`alert ${alertClass[type]}`}>
        <span>{message}</span>
        <button onClick={onClose} className="btn btn-sm btn-ghost">
          ✕
        </button>
      </div>
    </div>
  );
};

export default Toast;
