import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MainAPI } from "../../API";
import { FaImage, FaPlus, FaArrowLeft } from "react-icons/fa";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarStaff from "../NavBar/NavBarStaff";  // Import your Navbar component
import "./CreateProduct.scss";

export default function CreateProduct() {
    const navigate = useNavigate();
    const [imagePreviews, setImagePreviews] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${MainAPI}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                toast.error("Failed to fetch categories.");
            }
        };
        fetchCategories();
    }, []);

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "fiverr");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dmyyf65yy/image/upload",
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data.secure_url;
        } catch (error) {
            console.error("Error uploading image to Cloudinary:", error.response?.data || error.message);
            toast.error("Error uploading image.");
            return null;
        }
    };

    const formik = useFormik({
        initialValues: {
            productName: "",
            productInfor: "",
            productPrice: 0,
            productQuantity: 0,
            productCategoryId: "",
            images: [],
        },
        validationSchema: Yup.object({
            productName: Yup.string().required("Product Name is required"),
            productInfor: Yup.string().required("Product Information is required"),
            productPrice: Yup.number()
                .positive("Product Price must be greater than 0")
                .required("Product Price is required"),
            productQuantity: Yup.number()
                .positive("Product Quantity must be greater than 0")
                .required("Product Quantity is required"),
            productCategoryId: Yup.number().required("Product Category is required"),
            images: Yup.array().min(1, "At least one image is required"),
        }),
        onSubmit: async (values) => {
            try {
                const imageUrls = await Promise.all(values.images.map(async (file) => {
                    const imageUrl = await uploadImageToCloudinary(file);
                    return imageUrl ? imageUrl : null;
                }));

                const imagesFormatted = imageUrls.filter(Boolean).map((url, index) => ({
                    [`imageProduct${index + 1}`]: url,
                }));

                const productPayload = {
                    productName: values.productName,
                    productInfor: values.productInfor,
                    productPrice: values.productPrice,
                    productQuantity: values.productQuantity,
                    productCategoryId: Number(values.productCategoryId),
                    images: imagesFormatted,
                };

                const token = JSON.parse(localStorage.getItem("accessToken"));
                if (!token) {
                    console.error("No access token found.");
                    toast.error("No access token found.");
                    return;
                }

                await axios.post(`${MainAPI}/Product/add-product`, productPayload, {
                    headers: {
                        "x-access-token": token,
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Product created successfully!");
                navigate("/staff/manage_product");
            } catch (error) {
                console.error("Error creating product:", error);
                toast.error("Error creating product.");
            }
        },
    });

    const handleImageChange = (event) => {
        const files = Array.from(event.currentTarget.files);
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
        formik.setFieldValue("images", files);
    };

    return (
        <div className="layout-container">
            <NavbarStaff />
            <div className="content-container">
                <div className="createProduct_container">
                    <h1>Create Product</h1>
                    <form onSubmit={formik.handleSubmit} className="form">
                        <div className="form-group">
                            <label htmlFor="productName">Product Name</label>
                            <input
                                id="productName"
                                name="productName"
                                type="text"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.productName}
                            />
                            {formik.touched.productName && formik.errors.productName ? (
                                <div className="error">{formik.errors.productName}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="productInfor">Product Information</label>
                            <textarea
                                id="productInfor"
                                name="productInfor"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.productInfor}
                            />
                            {formik.touched.productInfor && formik.errors.productInfor ? (
                                <div className="error">{formik.errors.productInfor}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="productPrice">Product Price</label>
                            <input
                                id="productPrice"
                                name="productPrice"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.productPrice}
                            />
                            {formik.touched.productPrice && formik.errors.productPrice ? (
                                <div className="error">{formik.errors.productPrice}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="productQuantity">Product Quantity</label>
                            <input
                                id="productQuantity"
                                name="productQuantity"
                                type="number"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.productQuantity}
                            />
                            {formik.touched.productQuantity && formik.errors.productQuantity ? (
                                <div className="error">{formik.errors.productQuantity}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="productCategoryId">Product Category</label>
                            <select
                                id="productCategoryId"
                                name="productCategoryId"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.productCategoryId}
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.productCategoryId} value={category.productCategoryId}>
                                        {category.productCategoryName}
                                    </option>
                                ))}
                            </select>
                            {formik.touched.productCategoryId && formik.errors.productCategoryId ? (
                                <div className="error">{formik.errors.productCategoryId}</div>
                            ) : null}
                        </div>

                        <div className="form-group">
                            <label htmlFor="images">
                                <FaImage /> Product Images
                            </label>
                            <input
                                id="images"
                                name="images"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                            />
                            {formik.touched.images && formik.errors.images ? (
                                <div className="error">{formik.errors.images}</div>
                            ) : null}
                        </div>

                        <div className="image-previews">
                            {imagePreviews.map((imageSrc, index) => (
                                <img key={index} src={imageSrc} alt={`Preview ${index}`} className="preview-img" />
                            ))}
                        </div>

                        <button type="submit" className="btn submit-btn">
                            <FaPlus /> Create Product
                        </button>

                        <button
                            type="button"
                            className="btn back-btn"
                            onClick={() => navigate("/staff/manage_product")}
                        >
                            <FaArrowLeft /> Back
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
