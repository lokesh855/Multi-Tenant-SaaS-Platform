import { useEffect, useState } from "react";
import { API } from "../api/authApi";
import UserTable from "../components/UserTable";
import AddEditUserModal from "../components/AddEditUserModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import "../styles/Users.css";

export default function Users() {
  // ---------------------------
  // Get tenantId safely
  // ---------------------------
  const storedData = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  const tenantId = storedData?.user?.tenantId;

  // ---------------------------
  // State
  // ---------------------------
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  // ---------------------------
  // Fetch users
  // ---------------------------
  const fetchUsers = async () => {
    if (!tenantId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await API.get(`/tenants/${tenantId}/users`);
      const data = res?.data?.data?.users;
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users failed:", err);
      alert(err?.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [tenantId]);

  // ---------------------------
  // Filters
  // ---------------------------
  const filteredUsers = users.filter(
    u =>
      (
        u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
      ) &&
      (roleFilter ? u.role === roleFilter : true)
  );

  // ---------------------------
  // UI
  // ---------------------------
  if (loading) return <LoadingSpinner isVisible={true} message="Loading users..." />;

  return (
    <div>
      <Navbar />
      <div className="users-page">
      <div className="users-header">
        <h2>Users</h2>
        <button
          onClick={() => {
            setEditUser(null);
            setShowModal(true);
          }}
        >
          + Add User
        </button>
      </div>

      <div className="users-filters">
        <input
          placeholder="Search name or email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={roleFilter}
          onChange={e => setRoleFilter(e.target.value)}
        >
          <option value="">All Roles</option>
          <option value="tenant_admin">Tenant Admin</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <UserTable
          users={filteredUsers}
          onEdit={user => {
            setEditUser(user);
            setShowModal(true);
          }}
          onRefresh={fetchUsers}
        />
      )}

      <AddEditUserModal
        open={showModal}
        onClose={() => setShowModal(false)}
        user={editUser}
        tenantId={tenantId}
        onSuccess={fetchUsers}
      />
      </div>
    </div>
  );
}
