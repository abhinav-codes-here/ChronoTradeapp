// frontend/src/components/TopNavbar.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from './TopNavbar.module.css';
import chronoTrade from "../../assets/chronoTrade.png"

const TopNavbar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="top-navbar">
      <div className={`logo ${styles['user-logo-div']}`}>
          <img className={`${styles['user-logo']}`} src={chronoTrade} />
          ChronoTrade
        </div>
      {/* making text clickable so it routes home */}
      <Link className="logo" to="/dashboard">
        ChronoTrade
      </Link>
      <div className="top-links">
        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/wishlist">Wishlist</Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link className="btn-primary" to="/signup">
              Sign Up
            </Link>
          </>
        )}
        {user && (
          <button className="btn-text" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default TopNavbar;
