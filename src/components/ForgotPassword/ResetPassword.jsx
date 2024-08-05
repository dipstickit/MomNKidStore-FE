import axios from "axios";
import React, { useState } from "react";
import { MdOutlineArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { MainAPI } from "../API";
import { FaEyeSlash, FaLock } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

export default function ResetPassword() {
  const nav = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const queryParams = new URLSearchParams(window.location.search);
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPass = () => {
    setShowPassword(!showPassword);
  };

  const token = queryParams.get("token");
  console.log(token);

  const handleOnchangePassword = (event) => {
    setPassword(event.target.value);
  };

  const handleOnchangeConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    axios
      .post(`${MainAPI}/user/reset-password?token=${token}`, {
        newPassword: password,
        confirmPassword: confirmPassword,
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        nav("/login");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.errors[0].message);
      });
  };

  return (
    <>
      <div className="login-container">
        <ToastContainer autoClose={2000} />
        <div className="login-form">
          <h2>Nhập mật khẩu mới</h2>

          <form onSubmit={handleSubmit}>
            <div className="login-info mt-5 mb-5">
              <div className="login-detail">
                <FaLock />
                <input
                  type="password"
                  value={password}
                  placeholder="Password"
                  onChange={handleOnchangePassword}
                  required
                />
                <span className="eyes" onClick={handleShowPass}>
                  {showPassword === true ? <FaEyeSlash /> : <IoEyeSharp />}
                </span>
              </div>

              <div className="login-detail">
                <FaLock />
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Confirm Password"
                  onChange={handleOnchangeConfirmPassword}
                  required
                />
              </div>
            </div>
            <input type="submit" value="Xác nhận" className="login-btn"></input>
          </form>
        </div>
      </div>
    </>
  );
}
