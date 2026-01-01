import { API } from "../api/authApi";

export default function TaskCard({ task, onEdit, onRefresh }) {
  const updateStatus = async (status) => {
    if (task.status === status) return;

    try {
      await API.patch(`/tasks/${task.id}/status`, { status });
      onRefresh();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update task status");
    }
  };

  const deleteTask = async () => {
    if (!window.confirm("Delete task?")) return;

    try {
      await API.delete(`/tasks/${task.id}`);
      onRefresh();
    } catch (err) {
      console.error("Failed to delete task", err);
      alert("Failed to delete task");
    }
  };

  return (
    <div className="task-card">
      <h4>{task.title}</h4>

      <div className="badges">
        <span className={`status ${task.status}`}>
          {task.status.replace("_", " ")}
        </span>

        <span className={`priority ${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <p>
        <strong>Due:</strong>{" "}
        {task.dueDate
          ? new Date(task.dueDate).toLocaleDateString()
          : "N/A"}
      </p>

      <p>
        <strong>Assigned:</strong>{" "}
        {task.assignedTo?.fullName || "Unassigned"}
      </p>

      <div className="task-actions">
        <button onClick={() => onEdit(task)}>Edit</button>

        {task.status !== "completed" && (
          <button onClick={() => updateStatus("completed")}>
            Complete
          </button>
        )}

        <button className="danger" onClick={deleteTask}>
          Delete
        </button>
      </div>
    </div>
  );
}
