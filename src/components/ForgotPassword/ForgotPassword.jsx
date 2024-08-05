import React, { useState } from "react";
import "./ForgotPassword.scss";
import useAuth from "../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { MainAPI } from "../API";
import { toast, ToastContainer } from "react-toastify";
import { FaUser } from "react-icons/fa";
import { MdOutlineArrowBack } from "react-icons/md";
import axios from "axios";

export default function ForgotPassword() {
  const { auth, setAuth } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");

  const handleOnchangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(`${MainAPI}/user/request-password-reset`, {
        email: email,
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Định dạng email không hợp lệ hoặc không tồn tại!");
      });
  };
  return (
    <>
      <div className="login-container">
        <ToastContainer autoClose={2000} />
        <div className="login-form">
          <div
            className="fs-3 text-start back-btn"
            onClick={() => {
              nav("/login");
            }}
          >
            <MdOutlineArrowBack />
          </div>
          <h2>Đặt lại mật khẩu</h2>

          <form onSubmit={handleSubmit}>
            <div className="login-info mt-5 mb-5">
              <div className="login-detail">
                <FaUser />
                <input
                  type="text"
                  value={email}
                  placeholder="Nhập Email"
                  onChange={handleOnchangeEmail}
                  required
                />
              </div>
            </div>
            <input type="submit" value="Tiếp tục" className="login-btn"></input>
          </form>
        </div>
      </div>
    </>
  );
}
