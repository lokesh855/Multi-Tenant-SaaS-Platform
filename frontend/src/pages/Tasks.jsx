import { useEffect, useState } from "react";
import { API } from "../api/authApi";
import TaskModal from "../components/TaskModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import "../styles/Tasks.css";

export default function Tasks() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  // 🔹 Load projects once (no tasks yet)
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get("/projects");
        const data =
          res?.data?.data?.projects ||
          res?.data?.data ||
          [];
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // 🔍 Fetch tasks ONLY after search
  const handleSearch = async () => {
    if (!search.trim()) {
      setTasks([]);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setTasks([]);

      // 🔹 Match projects by name
      const matchedProjects = projects.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );

      if (matchedProjects.length === 0) {
        setError("No projects found");
        return;
      }

      // 🔹 Fetch tasks for matched projects
      const taskRequests = matchedProjects.map((project) =>
        API.get(`/projects/${project.id}/tasks`)
          .then((res) => {
            const taskData =
              res?.data?.data?.tasks ||
              res?.data?.data ||
              [];
            return taskData.map((task) => ({
              ...task,
              projectId: project.id,
              projectName: project.name,
            }));
          })
          .catch(() => [])
      );

      const results = await Promise.all(taskRequests);
      const mergedTasks = results.flat();

      setTasks(mergedTasks);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Update status
  const updateStatus = async (taskId, status) => {
    try {
      await API.patch(`/tasks/${taskId}/status`, { status });
      handleSearch(); // refresh list
    } catch {
      alert("Failed to update task status");
    }
  };

  if (initialLoading) return <LoadingSpinner isVisible={true} message="Loading tasks..." />;

  return (
    <div>
      <Navbar />
      <div className="tasks-page">
      {/* Header */}
      <div className="tasks-header">
        <h2>Tasks</h2>
      </div>

      {/* Search */}
      <div className="tasks-filters">
        <input
          placeholder="Search by project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner isVisible={true} message="Searching tasks..." />
      ) : error ? (
        <p className="error">{error}</p>
      ) : tasks.length === 0 ? (
        <p className="muted">Search a project name to view tasks</p>
      ) : (
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Project</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>

                <td>
                  <strong>{task.projectName}</strong>
                </td>

                <td>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateStatus(task.id, e.target.value)
                    }
                  >
                    <option value="todo">Todo</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>

                <td>{task.priority || "-"}</td>

                <td>
                  {task.dueDate
                    ? new Date(task.dueDate).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <button
                    onClick={() => {
                      setEditTask(task);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal */}
      <TaskModal
        isOpen={showModal}
        task={editTask}
        projectId={editTask?.projectId}
        onClose={() => setShowModal(false)}
        onSuccess={handleSearch}
      />
      </div>
    </div>
  );
}