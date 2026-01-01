import { useState } from "react";
import { API } from "../api/authApi";;
import "../styles/ProjectHeader.css";

export default function ProjectHeader({ project, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);

  const updateProject = async () => {
    await API.put(`/projects/${project.id}`, { name });
    setEditing(false);
    onUpdated();
  };

  const deleteProject = async () => {
    if (!window.confirm("Delete this project?")) return;
    await API.delete(`/projects/${project.id}`);
    onDeleted();
  };

  return (
    <div className="project-header">
      {editing ? (
        <input value={name} onChange={e => setName(e.target.value)} />
      ) : (
        <h2>{project.name}</h2>
      )}

      <span className={`badge ${project.status}`}>{project.status}</span>

      <p>{project.description}</p>

      <div className="actions">
        {editing ? (
          <button onClick={updateProject}>Save</button>
        ) : (
          <button onClick={() => setEditing(true)}>Edit</button>
        )}
        <button className="danger" onClick={deleteProject}>Delete</button>
      </div>
    </div>
  );
}
