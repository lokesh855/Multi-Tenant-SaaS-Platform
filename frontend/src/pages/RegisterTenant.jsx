import { useState } from "react";
import { registerTenant } from "../api/authApi";
import "../styles/RegisterTenant.css";
import { useNavigate, Link } from "react-router-dom";

const RegisterTenant = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    organizationName: "",
    subdomain: "",
    adminEmail: "",
    adminFullName: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validate = () => {
    if (
      !form.organizationName ||
      !form.subdomain ||
      !form.adminEmail ||
      !form.adminFullName ||
      !form.password ||
      !form.confirmPassword
    ) {
      return "All fields are required";
    }

    if (form.password.length < 6) {
      return "Password must be at least 6 characters";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match";
    }

    if (!form.termsAccepted) {
      return "You must accept the Terms & Conditions";
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);

      await registerTenant({
        tenantName: form.organizationName,
        subdomain: form.subdomain,
        adminEmail: form.adminEmail,
        adminFullName: form.adminFullName,
        adminPassword: form.password,
      });

      setSuccess("Tenant registered successfully! Redirecting to login...");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card wide" onSubmit={handleSubmit}>
        <h2>Create Organization</h2>

        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}

        <input
          type="text"
          name="organizationName"
          placeholder="Organization Name"
          onChange={handleChange}
        />

        <input
          type="text"
          name="subdomain"
          placeholder="Subdomain"
          onChange={handleChange}
        />
        <small className="preview">
          {form.subdomain || "yourorg"}.yourapp.com
        </small>

        <input
          type="email"
          name="adminEmail"
          placeholder="Admin Email"
          onChange={handleChange}
        />

        <input
          type="text"
          name="adminFullName"
          placeholder="Admin Full Name"
          onChange={handleChange}
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />
          <span onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"}
          </span>
        </div>

        <input
          type={showPassword ? "text" : "password"}
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
        />

        <label className="checkbox">
          <input
            type="checkbox"
            name="termsAccepted"
            onChange={handleChange}
          />
          I agree to the Terms & Conditions
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating Tenant..." : "Register"}
        </button>

        <p className="link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterTenant;
