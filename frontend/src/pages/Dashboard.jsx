import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import LoadingSpinner from "../components/LoadingSpinner";
import WelcomePopup from "../components/WelcomePopup";
import { getMe, getProjects } from "../api/authApi";
import { getMyTasks } from "../api/taskApi";
import "../styles/Dashboard.css";
import useAuthCheck from "../hooks/useAuthCheck";

const Dashboard = () => {
  useAuthCheck();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskFilter, setTaskFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        // ✅ Logged-in user
        const meRes = await getMe();
        const currentUser = meRes?.data?.data;
        if (!currentUser) throw new Error("User not found");
        setUser(currentUser);

        // ✅ Projects (SAFE normalize)
        const projectRes = await getProjects();
        const projectList =
          projectRes?.data?.data?.projects ||
          projectRes?.data?.data ||
          [];
        console.log("Projects:", projectList);
        setProjects(Array.isArray(projectList) ? projectList : []);

        // ✅ My tasks (optional but safe)
        try {
          const taskRes = await getMyTasks(currentUser.id);
          console.log("My Tasks:", taskRes?.data?.data);
          setTasks(Array.isArray(taskRes?.data?.data) ? taskRes.data.data : []);
        } catch {
          setTasks([]);
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
        setError("Failed to load dashboard data");
        setProjects([]);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Render loading spinner while fetching data
  if (loading) return <LoadingSpinner isVisible={true} message="Loading your dashboard..." />;
  if (error) return <div className="error">{error}</div>;

  // 📊 PROJECT-BASED STATS (BEST PRACTICE)
  const totalProjects = projects.length;

  const totalTasks = projects.reduce(
    (sum, p) => sum + (Number(p.taskCount) || 0),
    0
  );

  const completedTasks = projects.reduce(
    (sum, p) => sum + (Number(p.completedTaskCount) || 0),
    0
  );

  const pendingTasks = totalTasks - completedTasks;

  // 🔁 Task filter (SAFE)
  const filteredTasks =
    taskFilter === "all"
      ? tasks
      : tasks.filter(t => t.status === taskFilter);

  return (
    <div className="dashboard">
      <Navbar />
      <WelcomePopup user={user} />

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard 
          title="Total Projects" 
          value={totalProjects}
          icon="📊"
          color="primary"
        />
        <StatCard 
          title="Total Tasks" 
          value={totalTasks}
          icon="📋"
          color="info"
        />
        <StatCard 
          title="Completed Tasks" 
          value={completedTasks}
          icon="✅"
          color="success"
        />
        <StatCard 
          title="Pending Tasks" 
          value={pendingTasks}
          icon="⏳"
          color="warning"
        />
      </div>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Projects Section */}
        <div className="card">
          <div className="card-header">
            <h3>Recent Projects</h3>
            <button 
              className="btn-ghost"
              onClick={() => navigate('/projects')}
            >
              View All →
            </button>
          </div>

          <div className="card-body">
            {projects.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No projects yet</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/projects')}
                >
                  Create a Project
                </button>
              </div>
            ) : (
              <div className="projects-list">
                {projects.slice(0, 5).map(project => (
                  <div
                    key={project.id}
                    className="project-row"
                    onClick={() => navigate(`/projects/${project.id}`)}
                    role="button"
                    tabIndex="0"
                  >
                    <div className="project-info">
                      <h4>{project.name}</h4>
                      <span className={`status-badge status-${project.status}`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="project-meta">
                      <span className="task-count">{project.taskCount || 0} tasks</span>
                      <span className="arrow">→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tasks Section */}
        <div className="card">
          <div className="card-header">
            <h3>My Tasks</h3>
            <select
              value={taskFilter}
              onChange={e => setTaskFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tasks</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="card-body">
            {filteredTasks.length === 0 ? (
              <div className="empty-state">
                <p className="text-muted">No tasks found</p>
                <button 
                  className="btn-primary"
                  onClick={() => navigate('/tasks')}
                >
                  View All Tasks
                </button>
              </div>
            ) : (
              <div className="tasks-list">
                {filteredTasks.map(task => (
                  <div key={task.id} className="task-row">
                    <div className="task-info">
                      <h4>{task.title}</h4>
                      <p className="text-muted">{task.project?.name || 'No Project'}</p>
                    </div>
                    <div className="task-meta">
                      <span className={`priority-badge priority-${task.priority || 'low'}`}>
                        {task.priority || 'low'}
                      </span>
                      <span className="due-date">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'No date'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon = '📈', color = 'primary' }) => (
  <div className={`stat-card stat-card-${color}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <p className="stat-label">{title}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  </div>
);

export default Dashboard;