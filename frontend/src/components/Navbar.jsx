import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser, removeToken } from "../utils/auth";
import "../styles/Navbar.css";

const Navbar = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (!user) return null;
  
  let fullName, role;
  if (user?.user?.role === "super_admin") {
    ({ fullName, role } = user?.user);
  } else {
    ({ fullName, role } = user);
  }

  const logout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/dashboard">
          <span className="logo-text">ProjectHub</span>
        </Link>
      </div>

      {/* Hamburger */}
      <button
        className="hamburger"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
        aria-expanded={menuOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>

      {/* Menu */}
      <ul className={`nav-links ${menuOpen ? "active" : ""}`}>
        <li>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
        </li>

        <li>
          <Link to="/projects" onClick={() => setMenuOpen(false)}>Projects</Link>
        </li>

        {(role === "tenant_admin" || role === "super_admin") && (
          <li>
            <Link to="/tasks" onClick={() => setMenuOpen(false)}>Tasks</Link>
          </li>
        )}

        {role === "tenant_admin" && (
          <li>
            <Link to="/users" onClick={() => setMenuOpen(false)}>Users</Link>
          </li>
        )}

        {role === "super_admin" && (
          <li>
            <Link to="/tenants" onClick={() => setMenuOpen(false)}>Tenants</Link>
          </li>
        )}
      </ul>

      {/* User Dropdown */}
      <div className="navbar-user">
        <div
          className="user-menu"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          role="button"
          tabIndex="0"
        >
          <div className="user-avatar">
            {fullName?.charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <span className="user-name">{fullName}</span>
            <span className="user-role">{role.replace(/_/g, " ")}</span>
          </div>
          <span className={`dropdown-icon ${dropdownOpen ? "active" : ""}`}>▼</span>

          {dropdownOpen && (
            <div className="dropdown">
              <Link to="/profile" onClick={() => setDropdownOpen(false)}>👤 Profile</Link>
              <Link to="/settings" onClick={() => setDropdownOpen(false)}>⚙️ Settings</Link>
              <button onClick={logout}>🚪 Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
