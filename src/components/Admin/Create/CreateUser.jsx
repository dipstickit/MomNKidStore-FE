import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./CreateUser.scss";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainAPI } from "../../API";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import Navbar from "../NavBar/NavBar";
const CreateUser = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const nav = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        password: Yup.string()
            .min(6, "Password must be at least 6 characters")
            .required("Password is required"),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], "Passwords must match")
            .required("Confirm Password is required"),
        role: Yup.string()
            .required("Role is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
            role: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            console.log("Form data:", values);
            try {
                const token = JSON.parse(localStorage.getItem("accessToken"));
                const roleId = values.role === "Staff" ? 2 : 4;

                await axios.post(
                    `${MainAPI}/Admin/create-staff`,
                    {
                        email: values.email,
                        password: values.password,
                        confirmPassword: values.confirmPassword,
                        roleId: roleId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                toast.success("Staff account created successfully!");
                setTimeout(() => {
                    nav("/admin/user");
                }, 2000);
            } catch (error) {
                console.error("Error creating staff account:", error);
                toast.error("Failed to create staff account");
            }
        },
    });

    const handleBackClick = () => {
        nav(`/admin/user`);
    };

    return (
        <div className="create-user-page">
            <ToastContainer />
            <Navbar />
            <div className="create-staff-container">
                <h2>Create Account</h2>
                <form onSubmit={formik.handleSubmit} className="create-staff-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            {...formik.getFieldProps('email')}
                            className={formik.touched.email && formik.errors.email ? 'input-error' : ''}
                        />
                        {formik.touched.email && formik.errors.email ? (
                            <div className="error-message">{formik.errors.email}</div>
                        ) : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="password-input">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                {...formik.getFieldProps('password')}
                                className={formik.touched.password && formik.errors.password ? 'input-error' : ''}
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        {formik.touched.password && formik.errors.password ? (
                            <div className="error-message">{formik.errors.password}</div>
                        ) : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="password-input">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                name="confirmPassword"
                                {...formik.getFieldProps('confirmPassword')}
                                className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'input-error' : ''}
                            />
                            <span
                                className="toggle-password"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
                            </span>
                        </div>
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
                            <div className="error-message">{formik.errors.confirmPassword}</div>
                        ) : null}
                    </div>
                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            {...formik.getFieldProps('role')}
                            className={formik.touched.role && formik.errors.role ? 'input-error' : ''}
                        >
                            <option value="" label="Select role" />
                            <option value="Staff" label="Staff" />
                            <option value="Delivery" label="Delivery" />
                        </select>
                        {formik.touched.role && formik.errors.role ? (
                            <div className="error-message">{formik.errors.role}</div>
                        ) : null}
                    </div>
                    <button type="submit" className="submit-button">
                        Create Account
                    </button>
                    <button type="button" className="back-button" onClick={handleBackClick}>
                        <MdArrowBack /> Back to User Management
                    </button>
                </form>
            </div>
        </div>

    );
};

export default CreateUser;
