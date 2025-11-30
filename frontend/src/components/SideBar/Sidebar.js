// frontend/src/components/Sidebar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { label: "👤 Profile", path: "/sidebar/profile" },
    { label: "📚 Courses", path: "/sidebar/courses" },
    { label: "❤️ Wish List", path: "/sidebar/wish-list" },
    { label: "📊 Report", path: "/sidebar/report" },
    { label: "🚀 Getting Started", path: "/sidebar/getting-started" },
    { label: "⚙️ Settings", path: "/sidebar/settings" },
  ];

  return (
    <div className="sidebar-card">
      <ul>
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link to={item.path}>{item.label}</Link>
          </li>
        ))}
        <li>
          <button className="btn-text" onClick={logout}>
            ↩️ Log Out
          </button>
        </li>
      </ul>
      {user && (
        <div className="sidebar-user">
          <div className="avatar-circle">{user.name[0]}</div>
          <div>
            <div className="sidebar-username">{user.name}</div>
            <div className="sidebar-email">{user.email}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
