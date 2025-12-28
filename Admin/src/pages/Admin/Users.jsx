import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // ✅ Ganti dari @react-query
import { getUsers, deleteUser } from "../../services/api";
import UserForm from "../../components/Admin/common/userForm";
import { FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const queryClient = useQueryClient();

  const {
    data: users,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
    },
  });

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Terjadi kesalahan: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola User</h1>
        <button
          className="btn btn-primary"
          onClick={() => {
            setSelectedUser(null);
            setOpenForm(true);
          }}
        >
          Tambah User
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl shadow-md">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <div
                    className={`badge ${user.role === "admin" ? "badge-primary" : "badge-ghost"
                      }`}
                  >
                    {user.role}
                  </div>
                </td>
                <td>
                  <div
                    className={`badge ${user.status === "active" ? "badge-success" : "badge-error"
                      }`}
                  >
                    {user.status}
                  </div>
                </td>
                <td className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="btn btn-sm btn-info"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="btn btn-sm btn-error"
                    data-testid="delete-user-btn"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Komponen Form */}
      <UserForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default Users;
