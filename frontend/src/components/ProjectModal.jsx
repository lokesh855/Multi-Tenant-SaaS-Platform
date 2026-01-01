import { useState, useEffect } from "react";
import { API } from "../api/authApi";
import Modal from "./Modal";
import "../styles/modal.css";

export default function ProjectModal({
  isOpen,
  onClose,
  mode = "create",
  project = null,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  // ✅ Handle edit & create correctly
  useEffect(() => {
    if (mode === "edit" && project) {
      setForm({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "active",
      });
    }

    if (mode === "create") {
      setForm({
        name: "",
        description: "",
        status: "active",
      });
    }
  }, [mode, project]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim()) {
      return setError("Project name is required");
    }

    try {
      setLoading(true);

      if (mode === "create") {
        await API.post("/projects", form);
      } else {
        await API.put(`/projects/${project.id}`, form);
      }

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "edit" ? "Edit Project" : "Create Project"}
    >
      <div className="modal">
        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>Project Name *</label>
          <input
            name="name"
            id="modalinput"
            value={form.name}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
          />

          <label>Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="archived">Archived</option>
            <option value="completed">Completed</option>
          </select>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
