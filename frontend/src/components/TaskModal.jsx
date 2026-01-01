import { useState, useEffect } from "react";
import { API } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal";

const initialState = {
  title: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
  assignedTo: ""
};

export default function TaskModal({
  isOpen,
  onClose,
  projectId,
  task,
  onSuccess
}) {
  const [form, setForm] = useState(initialState);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(task);
  const { user: authUser } = useAuth();
  const tenantId = authUser?.user?.tenantId;
  // 🔹 Load users when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchUsers = async () => {
      try {
        const res = await API.get(`/tenants/${tenantId}/users`);
        const data =
          res?.data?.data?.users ||
          res?.data?.data ||
          [];
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load users");
      }
    };

    fetchUsers();
  }, [isOpen]);
  // 🔹 Populate form for edit mode
  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        status: task.status || "todo",
        priority: task.priority || "medium",
        dueDate: task.dueDate
          ? task.dueDate.split("T")[0]
          : "",
        assignedTo: task.assignedTo?.id || "" 
      });
    } else {
      setForm(initialState);
    }
  }, [task, isOpen]);

  if (!isOpen) return null;

  const submit = async () => {
    if (!form.title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!isEdit && !projectId) {
      alert("Project is required to create a task");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // ✅ API payload (IDs only)
      const payload = {
        title: form.title.trim(),
        status: form.status,
        priority: form.priority,
        dueDate: form.dueDate || null,
        assignedTo: form.assignedTo || null
      };
      console.log("Payload:", payload);
      if (isEdit) {
        await API.put(`/tasks/${task.id}`, payload);
      } else {
        await API.post(`/projects/${projectId}/tasks`, payload);
      }

      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? "Edit Task" : "Add Task"}>
      {error && <p className="error">{error}</p>}

      <input
        id="taskinput"
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
      />

      <select
        value={form.status}
        onChange={(e) =>
          setForm({ ...form, status: e.target.value })
        }
      >
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <select
        value={form.priority}
        onChange={(e) =>
          setForm({ ...form, priority: e.target.value })
        }
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      {/* ✅ Assign User (ID stored, Name shown) */}
      <select
        value={form.assignedTo}
        onChange={(e) =>
          setForm({ ...form, assignedTo: e.target.value })
        }
      >
        <option value="">Assign to user</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.fullName}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={form.dueDate}
        onChange={(e) =>
          setForm({ ...form, dueDate: e.target.value })
        }
      />

      <div className="modal-actions">
        <button onClick={onClose} disabled={loading}>
          Cancel
        </button>
        <button onClick={submit} disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </Modal>
  );
}