import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../api/authApi";
import ProjectHeader from "../components/ProjectHeader";
import TaskList from "../components/TaskList";
import TaskModal from "../components/TaskModal";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";
import "../styles/ProjectDetails.css";

export default function ProjectDetails() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      // ✅ Fetch all projects
      const projectsRes = await API.get("/projects");

      const projects =
        projectsRes?.data?.data?.projects ||
        projectsRes?.data?.data ||
        [];

      if (!Array.isArray(projects)) {
        throw new Error("Projects response invalid");
      }

      // ✅ Find current project
      const currentProject = projects.find(p => p.id === projectId);

      if (!currentProject) {
        navigate("/projects");
        return;
      }

      setProject(currentProject);

      // ✅ Fetch tasks for project
      const tasksRes = await API.get(`/projects/${projectId}/tasks`);
      console.log("Fetched tasks:", tasksRes);
      setTasks(Array.isArray(tasksRes?.data?.data?.tasks) ? tasksRes.data.data.tasks : []);

    } catch (err) {
      console.error("Failed to load project details", err);
      navigate("/projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [projectId]);

  if (loading) return <LoadingSpinner isVisible={true} message="Loading project details..." />;
  if (!project) return null;

  return (
    <div>
      <Navbar />
      <div className="project-details">
      <ProjectHeader
        project={project}
        onUpdated={fetchData}
        onDeleted={() => navigate("/projects")}
      />

      <div className="task-header">
        <h3>Tasks</h3>
        <button
          onClick={() => {
            setEditTask(null);
            setShowTaskModal(true);
          }}
        >
          + Add Task
        </button>
      </div>

      <TaskList
        tasks={tasks}
        onEdit={task => {
          setEditTask(task);
          setShowTaskModal(true);
        }}
        onRefresh={fetchData}
      />

      <TaskModal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        projectId={projectId}
        task={editTask}
        onSuccess={fetchData}
      />
      </div>
    </div>
  );
}