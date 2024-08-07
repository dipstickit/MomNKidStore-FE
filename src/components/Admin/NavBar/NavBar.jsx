import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../API";
import "./NavBar.scss";
import { toast } from 'react-toastify';

export default function NavBar() {
  const token = JSON.parse(localStorage.getItem("accessToken"));
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth');
    toast.success('Đăng xuất thành công');
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
            Users
          </Link>
        </li>
        <li>
          <Link
            to="/admin/product"
            className="navbar-link"
          >
            Product
          </Link>
        </li>
        <li>
          <a onClick={handleLogout} className="navbar-link">Đăng xuất</a>
        </li>
      </ul>
    </nav>
  );
}
