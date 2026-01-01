import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/authApi";
import "../styles/Login.css";
import { useAuth } from "../context/AuthContext";

const SuperAdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await loginUser({
        email: form.email,
        password: form.password,
        tenantSubdomain: "None",
      });

      const { token, user } = res.data.data;

      if (user.role !== "super_admin") {
        setError("Unauthorized access");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      login(res.data.data);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Invalid super admin credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>Super Admin Login</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Super Admin Email"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default SuperAdminLogin;