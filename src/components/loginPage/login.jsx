import React, { useState } from "react";
import "./login.scss";
import { FaUser, FaLock, FaEyeSlash, FaHome } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { MainAPI } from "../API";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../hooks/useAuth";
import { useFormik } from "formik";
import * as Yup from "yup";

function Login() {
  const { setAuth } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: "/home" };
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
      password: Yup.string().required("Vui lòng nhập mật khẩu"),
    }),
    onSubmit: async (values) => {
      const response = await login(values.email, values.password);
      if (response.status === 200) {
        const user = response.user;
        const role = response.user.role_id;
        const accessToken = response.accessToken;

        setAuth({ user, role, accessToken });
        localStorage.setItem("accessToken", JSON.stringify(response.accessToken));
        localStorage.setItem("auth", JSON.stringify({ user, role, accessToken }));
        if (role === "admin") {
          nav("/admin");
        } else if (role === "staff") {
          nav("/staff");
        } else if (role === "customer") {
          nav("/home");
        } else {
          nav(from, { replace: true });
        }
      } else {
        toast.error(response.message);
      }
    },
  });

  const handleShowPass = () => {
    setShowPassword(!showPassword);
  };

  const login = async (email, password) => {
    const data = await fetch(`${MainAPI}/user/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    }).then((res) => {
      return res.json();
    });
    return data;
  };

  return (
    <>
      <div className="login-container">
        <ToastContainer autoClose={2000} />
        <div className="login-form">
          <h2>Đăng nhập</h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="login-info">
              <div className="login-detail">
                <FaUser />
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={formik.values.email}
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                {formik.touched.email && formik.errors.email ? (
                  <div className="error mt-5">{formik.errors.email}</div>
                ) : null}
              </div>

              <div className="login-detail">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formik.values.password}
                  placeholder="Mật khẩu"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  required
                />
                <span className="eyes" onClick={handleShowPass}>
                  {showPassword ? <FaEyeSlash /> : <IoEyeSharp />}
                </span>
                {formik.touched.password && formik.errors.password ? (
                  <div className="error m-0">{formik.errors.password}</div>
                ) : null}
              </div>
            </div>
            <div className="other">
              <Link to="/register">Tạo tài khoản</Link>
              <Link to="/forgot-password">Quên mật khẩu?</Link>
            </div>

            <input type="submit" value="Log In" className="login-btn" />
          </form>
          <div className="additional-buttons">
            <Link to="/" className="btn-secondary">
              <FaHome className="home-icon" /> Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
