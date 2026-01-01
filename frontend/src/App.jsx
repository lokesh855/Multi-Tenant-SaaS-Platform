import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import RegisterTenant from "./pages/RegisterTenant";
import ProtectedRoute from "./routes/ProtectedRoute";
import Projects from "./pages/ProjectList";
import Users from "./pages/Users";
import ProjectsId from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import SuperAdminLogin from "./pages/SuperAdminLogin";
import Tenants from "./pages/Tenants";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterTenant />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/superadmin/login" element={<SuperAdminLogin />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/users" element={<Users />} />
        <Route path="/projects/:projectId" element={<ProjectsId />} />
        <Route path="/projects/:projectId/tasks" element={<ProjectsId />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tenants" element={<Tenants />} />
      </Route>
    </Routes>
  );
};

export default App;
