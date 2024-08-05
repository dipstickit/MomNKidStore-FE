import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainAPI } from "../../API";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import NavBar from "../NavBar/NavBar";

export default function CreateUser() {
  const nav = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
    role_id: "",
  });
  const [errors, setErrors] = useState([]);
  console.log(user);

  function handleSubmit(e) {
    e.preventDefault();
    axios
      .post(`${MainAPI}/admin/create`, user, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        if (res.status === 200) {
          toast.success(res.data.message);
          setTimeout(() => {
            nav("/admin/user");
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        setErrors(err.response.data.errors);
      });
  }

  const specificError = (name) => {
    return errors.find((err) => err.name === name);
  };

  return (
    <div className="edit-container d-flex">
      <ToastContainer />
      <NavBar />
      <div className="content">
        <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
          <div className="w-50 border bg-secondary text-white p-5">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Tên đăng nhập:
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className="form-control"
                  placeholder="Enter username"
                  value={user.username}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      username: e.target.value,
                    })
                  }
                />
                {specificError("username") && (
                  <p className="text-danger fw-bold">{specificError("username").message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email:
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={user.email}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      email: e.target.value,
                    })
                  }
                />
                {specificError("email") && (
                  <p className="text-danger fw-bold">{specificError("email").message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Mật khẩu:
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={user.password}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      password: e.target.value,
                    })
                  }
                />
                {specificError("password") && (
                  <p className="text-danger fw-bold">{specificError("password").message}</p>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="role_id" className="form-label">
                  Role:
                </label>
                <select
                  id="role_id"
                  name="role_id"
                  className="form-select"
                  value={user.role_id}
                  onChange={(e) =>
                    setUser({
                      ...user,
                      role_id: e.target.value,
                    })
                  }
                >
                  <option value="">Choose role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
                {specificError("role_id") && (
                  <p className="text-danger fw-bold">{specificError("role_id").message}</p>
                )}
              </div>

              <div className="d-flex justify-content-between">
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={() => {
                    nav("/admin/user");
                  }}
                >
                  Hủy
                </button>
                <button type="submit" className="btn btn-info">
                  Tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
