import { useState, useEffect, useCallback } from "react";
import { getProjects, deleteProject } from "../api/projectApi";
import "../styles/ProjectsList.css";
import ProjectModal from "../components/ProjectModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";   

const ProjectsList = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editProject, setEditProject] = useState(null);

  // Fetch projects
  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await getProjects(statusFilter);

      const data =
        res?.data?.data?.projects ||
        res?.data?.data ||
        [];

      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch projects"
      );
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Create
  const handleCreate = () => {
    setEditProject(null);
    setShowModal(true);
  };

  // Edit
  const handleEdit = (project) => {
    setEditProject(project);
    setShowModal(true);
  };

  // Delete
  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      await deleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // Search
  const filteredProjects = projects.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <LoadingSpinner isVisible={true} message="Loading your projects..." />;

  return (
    <div>
      <Navbar />
      <div className="projects-container">
      {/* Header */}
      <div className="projects-header">
        <h2>Projects</h2>
        <button className="create-btn" onClick={handleCreate}>
          + Create New Project
        </button>
      </div>

      {/* Filters */}
      <div className="projects-filters">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Content */}
      {filteredProjects.length === 0 ? (
        <p className="empty">No projects found.</p>
      ) : (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <div className="project-card" key={project.id}>
              <div className="project-info">
                <h3>{project.name}</h3>

                <p id="description">
                  {project.description
                    ? project.description.substring(0, 80)
                    : "No description"}
                  ...
                </p>

                <div className="badges">
                  <span className={`status ${project.status}`}>
                    {project.status}
                  </span>

                  <span className="task-count">
                    {project.taskCount ?? 0} Tasks
                  </span>
                </div>

                <small>
                  Created by {project.createdBy || "N/A"} •{" "}
                  {project.createdAt
                    ? new Date(project.createdAt).toLocaleDateString()
                    : "—"}
                </small>
              </div>

              <div className="project-actions">
                {/* ✅ UPDATED */}
                <button
                  onClick={() =>
                    navigate(`/projects/${project.id}/tasks`)
                  }
                >
                  View Tasks
                </button>

                <button onClick={() => handleEdit(project)}>
                  Edit
                </button>

                <button
                  className="delete"
                  onClick={() => handleDelete(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <ProjectModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mode={editProject ? "edit" : "create"}
        project={editProject}
        onSuccess={fetchProjects}
      />
      </div>
    </div>
  );
};

export default ProjectsList;