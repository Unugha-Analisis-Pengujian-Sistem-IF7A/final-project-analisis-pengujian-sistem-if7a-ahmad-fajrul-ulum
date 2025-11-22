import { useState } from "react";
import Header from "../components/Admin/Header";
import Sidebar from "../components/Admin/Sidebar";
import { Outlet } from "react-router-dom";
import Toast from "../components/Admin/common/Toast";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const showToast = () => {
    setToast(null);
  };
  return (
    <div className="min-h-screen flex bg-base-100">
      <Sidebar open={isSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Header onSidebarToggle={toggleSidebar} />
        <main className="p-4 sm:pl-12">
          <Outlet />
        </main>
        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={showToast}
          />
        )}
      </div>
    </div>
  );
};

export default AdminLayout;
