import React, { useState } from "react";
import "./Register.scss";
import { FaUser, FaLock, FaEyeSlash, FaHome, FaPhone } from "react-icons/fa";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoEyeSharp } from "react-icons/io5";
import { useFormik } from "formik";
import { MainAPI } from "../API";
import * as Yup from "yup";
import axios from "axios";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const nav = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      dob: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp")
        .required("Re-entering password is required"),
      phone: Yup.string().required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      dob: Yup.date().required("Date of birth is required"),
    }),
    onSubmit: async (values) => {
      const payload = {
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        userName: values.username,
        phone: values.phone,
        address: values.address,
        dob: values.dob,
      };

      try {
        const response = await axios.post(
          `${MainAPI}/Auth/register-customer`,
          payload
        );
        toast.success("Registration successful! Redirecting");
        setTimeout(() => {
          nav("/login");
        }, 2000);
      } catch (err) {
        toast.error(
          err.response?.data?.errors || "An error occurred. Please try again."
        );
      }
    },
  });

  const handleShowPass = () => {
    setShowPassword(!showPassword);
  };

  const handleShowPassConfirm = () => {
    setShowPasswordConfirm(!showPasswordConfirm);
  };

  return (
    <>
      <div className="register-container d-flex justify-content-center align-items-center">
        <ToastContainer autoClose={2000} />
        <div className="register-form">
          <h2 className="mt-2">Register</h2>
          <form onSubmit={formik.handleSubmit}>
            <div className="register-info">
              <div className="register-detail">
                <FaUser />
                <input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  placeholder="Username"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.username && formik.errors.username ? (
                <p className="text-danger m-0">{formik.errors.username}</p>
              ) : null}

              <div className="register-detail">
                <MdEmail />
                <input
                  type="text"
                  name="email"
                  value={formik.values.email}
                  placeholder="Email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <p className="text-danger m-0">{formik.errors.email}</p>
              ) : null}

              <div className="register-detail">
                <FaLock />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formik.values.password}
                  placeholder="Password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span className="eyes" onClick={handleShowPass}>
                  {showPassword ? <FaEyeSlash /> : <IoEyeSharp />}
                </span>
              </div>
              {formik.touched.password && formik.errors.password ? (
                <p className="text-danger m-0">{formik.errors.password}</p>
              ) : null}

              <div className="register-detail">
                <FaLock />
                <input
                  type={showPasswordConfirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formik.values.confirmPassword}
                  placeholder="Re-enter password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <span className="eyes" onClick={handleShowPassConfirm}>
                  {showPasswordConfirm ? <FaEyeSlash /> : <IoEyeSharp />}
                </span>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                <p className="text-danger m-0">{formik.errors.confirmPassword}</p>
              ) : null}

              <div className="register-detail">
                <FaPhone />
                <input
                  type="text"
                  name="phone"
                  value={formik.values.phone}
                  placeholder="Phone number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.phone && formik.errors.phone ? (
                <p className="text-danger m-0">{formik.errors.phone}</p>
              ) : null}

              <div className="register-detail">
                <MdLocationOn />
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  placeholder="Address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.address && formik.errors.address ? (
                <p className="text-danger m-0">{formik.errors.address}</p>
              ) : null}

              <div className="register-detail">
                <input
                  type="date"
                  name="dob"
                  value={formik.values.dob}
                  placeholder="Date of birth"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.dob && formik.errors.dob ? (
                <p className="text-danger m-0">{formik.errors.dob}</p>
              ) : null}
            </div>
            <div className="other">
              <div>
                <Link to="/login">Already have an account?</Link>
              </div>
            </div>

            <input type="submit" value="Đăng ký" className="register-btn" />
          </form>
          <div className="additional-buttons">
            <Link to="/" className="btn-secondary">
              <FaHome className="home-icon" /> Back to home page
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
