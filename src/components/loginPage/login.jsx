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

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token");
    return null;
  }
}

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
      try {
        const response = await login(values.email, values.password);
        console.log("API Response: ", response);

        if (response.accessToken) {
          const accessToken = response.accessToken;

          try {
            // Tự giải mã token để lấy role
            const decodedToken = parseJwt(accessToken);
            if (!decodedToken) {
              throw new Error("Token is invalid");
            }
            console.log("Decoded Token: ", decodedToken);
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            console.log("Role: ", role);

            setAuth({ accessToken });
            localStorage.setItem("auth", JSON.stringify({ accessToken }));

            if (role === "1") {
              nav("/admin");
            } else if (role === "2") {
              nav("/staff");
            } else if (role === "3") {
              nav("/");
            } else {
              nav(from, { replace: true });
            }
          } catch (error) {
            console.error("Error decoding token: ", error);
            toast.error("Invalid token");
          }
        } else {
          toast.error(response.message || "Login failed");
        }
      } catch (error) {
        console.error("Login error: ", error);
        toast.error("Login failed due to server error");
      }
    },
  });

  const handleShowPass = () => {
    setShowPassword(!showPassword);
  };

  const login = async (email, password) => {
    const response = await fetch(`${MainAPI}/Auth/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
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
