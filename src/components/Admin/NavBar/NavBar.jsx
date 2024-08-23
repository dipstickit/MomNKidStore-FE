import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../API";
import "./NavBar.scss";
import { ToastContainer, toast } from 'react-toastify';

export default function NavBar() {
  const token = JSON.parse(localStorage.getItem("accessToken"));
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth');
    toast.success('Logout Successfully');
    nav('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">Admin Panel</div>
      <ul className="navbar-menu">
        <li>
          <Link
            to="/admin/dashboard"
            className="navbar-link"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/admin/user"
            className="navbar-link"
          >
            Account Management
          </Link>
        </li>
        <li>
          <a onClick={handleLogout} className="navbar-link">Logout</a>
        </li>
      </ul>
    </nav>
  );
}
