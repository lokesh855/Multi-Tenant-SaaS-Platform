import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import "../styles/globals.css";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
    subdomain: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.subdomain) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: form.email,
        password: form.password,
        tenantSubdomain: form.subdomain,
      });

      const { token, user } = res.data.data;

      if (form.rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(user));
      }

      login(res.data.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid credentials or tenant not found"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <LoadingSpinner isVisible={loading} message="Fetching your data..." />
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {error && <div className="error">{error}</div>}

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <input
            type="text"
            name="subdomain"
            placeholder="Tenant Subdomain"
            onChange={handleChange}
          />

          <small className="preview">
            {form.subdomain || "demo"}.yourapp.com
          </small>

          <label className="checkbox">
            <input
              type="checkbox"
              name="rememberMe"
              onChange={handleChange}
            />
            Remember Me
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="link">
            New organization? <Link to="/register">Register here</Link>
          </p>

          {/* ✅ Super Admin Login Link */}
          <p className="link">
            Are you a Super Admin?{" "}
            <Link to="/superadmin/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
