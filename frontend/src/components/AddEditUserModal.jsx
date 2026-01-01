import { useEffect, useState } from "react";
import { API } from "../api/authApi";
import "../styles/UserModal.css";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

const initialState = {
  email: "",
  fullName: "",
  password: "",
  role: "user",
  isActive: true
};

export default function AddEditUserModal({
  open,
  onClose,
  user: editUser,
  onSuccess
}) {
  const { user: authUser } = useAuth();
  const tenantId = authUser?.user?.tenantId;

  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(editUser);

  // ---------------------------
  // Prefill form
  // ---------------------------
  useEffect(() => {
    if (editUser) {
      setForm({
        email: editUser.email || "",
        fullName: editUser.fullName || "",
        password: "",
        role: editUser.role || "user",
        isActive: editUser.isActive ?? true
      });
    } else {
      setForm(initialState);
    }
  }, [editUser]);

  // ---------------------------
  // Validation
  // ---------------------------
  const validate = () => {
    const errs = {};

    if (!form.email.trim()) errs.email = "Email is required";
    if (!form.fullName.trim()) errs.fullName = "Full name is required";

    if (!isEdit && !form.password)
      errs.password = "Password is required";

    if (form.password && form.password.length < 6)
      errs.password = "Password must be at least 6 characters";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ---------------------------
  // Submit
  // ---------------------------
  const handleSubmit = async () => {
    if (!validate()) return;
    if (!tenantId) return alert("Tenant not found");

    try {
      setLoading(true);

      // ✅ FIX 2: Build payload safely
      const payload = {
        email: form.email.trim(),
        fullName: form.fullName.trim(),
        role: form.role,
        isActive: form.isActive
      };

      // only send password if provided
      if (form.password) {
        payload.password = form.password;
      }

      if (isEdit) {
        await API.put(`/users/${editUser.id}`, payload);
      } else {
        await API.post(`/tenants/${tenantId}/users`, payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setErrors({
        API: err.response?.data?.message || "Something went wrong"
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // UI
  // ---------------------------
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={isEdit ? "Edit User" : "Add User"}
    >
      {errors.API && <p className="error">{errors.API}</p>}

      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={form.email}
          onChange={e =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && <small>{errors.email}</small>}
      </div>

      <div className="form-group">
        <label>Full Name</label>
        <input
          value={form.fullName}
          onChange={e =>
            setForm({ ...form, fullName: e.target.value })
          }
        />
        {errors.fullName && <small>{errors.fullName}</small>}
      </div>

      <div className="form-group">
        <label>
          Password {isEdit && "(leave blank to keep current)"}
        </label>
        <input
          type="password"
          value={form.password}
          onChange={e =>
            setForm({ ...form, password: e.target.value })
          }
        />
        {errors.password && <small>{errors.password}</small>}
      </div>

      <div className="form-group">
        <label>Role</label>
        <select
          value={form.role}
          onChange={e =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="user">User</option>
          <option value="tenant_admin">Tenant Admin</option>
        </select>
      </div>

      <div className="checkbox-row">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={e =>
            setForm({ ...form, isActive: e.target.checked })
          }
        />
        <label>Active</label>
      </div>

      <div className="modal-actions">
        <button className="secondary" onClick={onClose}>
          Cancel
        </button>
        <button disabled={loading} onClick={handleSubmit}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}