import RoleBadge from "./RoleBadge";
import { API } from "../api/authApi";
import "../styles/UsersTable.css";

export default function UserTable({ users = [], onEdit, onRefresh }) {
  const deleteUser = async (id) => {
    if (!window.confirm("Delete user?")) return;

    try {
      await API.delete(`/users/${id}`);
      onRefresh();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  if (!users.length) return <p>No users found</p>;

  return (
    <table className="users-table">
      <thead>
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Created</th>
          <th>Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            {/* ✅ FIX 1: correct field names */}
            <td>{u.fullName}</td>
            <td>{u.email}</td>

            <td>
              <RoleBadge role={u.role} />
            </td>
            <td>
              <span className={u.isActive ? "Active" : "inactive"}>
                {u.isActive ? "Active" : "Inactive"}
              </span>
            </td>

            {/* ✅ FIX 2: correct date field */}
            <td>
              {u.createdAt
                ? new Date(u.createdAt).toLocaleDateString()
                : "-"}
            </td>

            <td id='buttons'>
              <button onClick={() => onEdit(u)}>Edit</button>
              <button
                className="danger"
                onClick={() => deleteUser(u.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}