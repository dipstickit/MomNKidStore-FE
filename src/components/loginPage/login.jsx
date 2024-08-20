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
import { jwtDecode } from "jwt-decode";

function Login() {
  const { setAuth } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  const from = location.state?.from || { pathname: "/home" };
  const [showPassword, setShowPassword] = useState(false);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${MainAPI}/Auth/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      console.log("API Response:", data);

      if (response.ok) {
        return data;
      } else {
        return { status: response.status, message: data.message || "Đăng nhập không thành công" };
      }
    } catch (error) {
      console.error("API call error:", error);
      return { status: 500, message: "Đã xảy ra lỗi. Vui lòng thử lại." };
    }
  };

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
        console.log("Login Response:", response);

        const { accessToken } = response;
        if (!accessToken) {
          throw new Error("No access token found in the response.");
        }

        console.log("Access Token:", accessToken);

        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        console.log("Token stored:", localStorage.getItem("accessToken"));

        var decodedToken = jwtDecode(accessToken);
        console.log("Decoded Token:", decodedToken);

        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        console.log("Role:", role);

        if (!role) {
          throw new Error("Role claim is missing in the token.");
        }

        setAuth({ role, accessToken });
        localStorage.setItem("auth", JSON.stringify({ role, accessToken }));

        if (role === "1") {
          toast.success("Login Admin successfully");
          nav("/admin");
        } else if (role === "2") {
          toast.success("Login Staff successfully");
          nav("/staff");
        } else if (role === "3") {
          toast.success("Login User successfully");
          nav("/");
        } else if (role === "4") {
          toast.success("Login Deliverier successfully");
          nav("/deliverier");
        }
        else {
          nav(from, { replace: true });
        }

      } catch (error) {
        console.error("Error during login:", error);
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  });

  const handleShowPass = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login-container">
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