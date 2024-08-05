import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../API";
import "./NavBar.scss";

export default function NavBar() {
  const token = JSON.parse(localStorage.getItem("accessToken"));
  const nav = useNavigate();

  const handleLogout = () => {
    axios
      .post(`${MainAPI}/user/logout`, token, {
        headers: {
          "x-access-token": token,
        },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.removeItem("accessToken");
        nav("/login");
      })
      .catch((err) => {
        console.log(err);
      });
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
          <a href="#settings" className="navbar-link">Settings</a>
        </li>
        <li>
          <a onClick={handleLogout} className="navbar-link">Logout</a>
        </li>
      </ul>
    </nav>
  );
}
