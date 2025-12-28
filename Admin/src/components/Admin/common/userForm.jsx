import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createUser, updateUser } from "../../../services/api";

import PropTypes from "prop-types";

const UserForm = ({ open, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    status: "active",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        password: "",
      });
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: (data) => (user ? updateUser(user.id, data) : createUser(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      onClose();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (!open) return null;

  return (
    <dialog open={open} className="modal modal-open">
      <div className="modal-box w-full max-w-2xl rounded-2xl shadow-xl p-6">
        <h3 className="text-xl font-semibold mb-6 text-center">
          {user ? "Edit User" : "Tambah User Baru"}
        </h3>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="form-control">
            <label className="label font-medium">Nama</label>
            <input
              type="text"
              placeholder="Nama Lengkap"
              className="input input-bordered focus:ring focus:ring-primary"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-medium">Email</label>
            <input
              type="email"
              placeholder="Email"
              className="input input-bordered focus:ring focus:ring-primary"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {!user && (
            <div className="form-control ">
              <label className="label font-medium">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="input input-bordered focus:ring focus:ring-primary"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>
          )}

          <div className="form-control">
            <label className="label font-medium">Role</label>
            <select
              className="select select-bordered"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="form-control">
            <label className="label font-medium">Status</label>
            <select
              className="select select-bordered"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="modal-action col-span-1 md:col-span-2 flex justify-end gap-3 mt-6">
            <button type="button" className="btn btn-neutral" onClick={onClose}>
              Batal
            </button>
            <button
              type="submit"
              className="btn btn-primary hover:scale-105 transition-transform duration-200"
            >
              {user ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
};

UserForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default UserForm;
