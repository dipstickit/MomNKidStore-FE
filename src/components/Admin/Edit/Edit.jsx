import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavBar from "../NavBar/NavBar";
import "./Edit.scss";
import { MainAPI } from "../../API";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Edit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [user, setUser] = useState({
    username: "",
    email: "",
  });
  const [errors, setErrors] = useState([]);

  console.log(user);
  const [role, setRole] = useState("");

  useEffect(() => {
    fetch(`${MainAPI}/admin/getUser/${id}`, {
      headers: {
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const result = data.user[0];
        setUser({
          username: result.username,
          email: result.email,
        });
        setRole(result.role_id);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        `${MainAPI}/admin/update/${id}`,
        { ...user, role_id: role },
        {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setTimeout(() => {
          nav("/admin/user");
        }, 2000);
      })
      .catch((err) => {
        console.log(err.response.data.errors);
        setErrors(err.response.data.errors);
      });
  };

  const specificError = (name) => {
    return errors.find((err) => {
      return err.name === name;
    });
  };

  return (
    <div className="edit-container d-flex">
      <ToastContainer />
      <NavBar />
      <div className="content">
        <div className="d-flex w-100 vh-100 justify-content-center align-items-center">
          <div className="w-50 border bg-secondary text-white p-5">
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="mb-3">
                  Tên đăng nhập:{" "}
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="Entername"
                  value={user.username}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
              {specificError("username") && (
                <p className="text-danger fw-bold m-0">
                  {specificError("username").message}
                </p>
              )}

              <div>
                <label htmlFor="email" className="my-2">
                  Email:{" "}
                </label>
                <input
                  type="text"
                  name="email"
                  className="form-control"
                  placeholder="Enteremail"
                  value={user.email}
                  onChange={(e) => {
                    setUser({
                      ...user,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
              {specificError("email") && (
                <p className="text-danger fw-bold m-0">
                  {specificError("email").message}
                </p>
              )}

              <div>
                <label className="my-2">Role:</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                  <option value="customer">Customer</option>
                </select>
              </div>
              <br />
              <button
                className="btn btn-light me-3"
                onClick={() => {
                  nav("/admin/user");
                }}
              >
                Hủy
              </button>
              <button className="btn btn-info">Lưu</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
