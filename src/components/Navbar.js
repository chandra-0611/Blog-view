import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Blog Platform</Link>
        
        <div className="navbar-nav mx-auto">
          <Link className="nav-link btn btn-outline-light mx-2" to="/">
            <i className="bi bi-house me-1"></i>Home
          </Link>
          <Link className="nav-link btn btn-outline-light" to="/create">
            <i className="bi bi-plus-circle me-1"></i>Add Blog
          </Link>
        </div>
        
        <div className="navbar-nav">
          {user ? (
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center me-3">
                <img 
                  src={user.profilePic} 
                  alt={user.name}
                  className="profile-picture-small me-2"
                />
                <span className="text-light">Welcome, {user.name}</span>
              </div>
              <button 
                onClick={logout} 
                className="nav-link btn btn-outline-danger"
              >
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </div>
          ) : (
            <>
              <Link className="nav-link btn btn-success mx-2" to="/login">
                <i className="bi bi-box-arrow-in-right me-1"></i>Login
              </Link>
              <Link className="nav-link btn btn-primary" to="/signup">
                <i className="bi bi-person-plus me-1"></i>Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
