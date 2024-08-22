import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import "./EditCategory.scss";
import { MainAPI } from "../../API";
import NavbarStaff from "../NavBar/NavBarStaff";  // Import NavbarStaff

const EditCategory = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategory = async () => {
            const token = JSON.parse(localStorage.getItem("accessToken"));

            if (!token) {
                toast.error("No access token found. Please log in again.");
                return;
            }

            try {
                const response = await axios.get(
                    `${MainAPI}/ProductCategory/${categoryId}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setCategory(response.data);
                formik.setValues({
                    categoryName: response.data.productCategoryName,
                });
            } catch (error) {
                console.error("Error fetching category details:", error);
                toast.error("An error occurred while fetching category details.");
            }
        };

        fetchCategory();
    }, [categoryId]);

    const validationSchema = Yup.object({
        categoryName: Yup.string()
            .required("Category name is required")
            .min(2, "Category name must be at least 2 characters")
            .max(50, "Category name cannot exceed 50 characters"),
    });

    const formik = useFormik({
        initialValues: {
            categoryName: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            const token = JSON.parse(localStorage.getItem("accessToken"));

            if (!token) {
                toast.error("No access token found. Please log in again.");
                return;
            }

            try {
                await axios.put(
                    `${MainAPI}/ProductCategory/${categoryId}`,
                    {
                        productCategoryName: values.categoryName,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                toast.success("Category updated successfully");
                navigate("/staff/manage_pcategory");
            } catch (error) {
                console.error("Error updating category:", error);
                toast.error("An error occurred while updating the category.");
            }
        },
    });

    const handleBack = () => {
        navigate("/staff/manage_pcategory");
    };

    return (
        <div className="layout-container">
            <NavbarStaff />
            <div className="content-container">
                <div className="edit-category">
                    <h2>Edit Category</h2>
                    {category ? (
                        <form onSubmit={formik.handleSubmit} className="edit-form">
                            <div className="form-group">
                                <label>Category Name:</label>
                                <input
                                    type="text"
                                    name="categoryName"
                                    value={formik.values.categoryName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.categoryName && formik.errors.categoryName ? (
                                    <div className="error-message">{formik.errors.categoryName}</div>
                                ) : null}
                            </div>
                            <div className="button-group">
                                <button type="button" className="back-button" onClick={handleBack}>
                                    <FaArrowLeft /> Back to Manage Category
                                </button>
                                <button type="submit" className="update-button">
                                    <FaSave /> Update Category
                                </button>
                            </div>
                        </form>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditCategory;
