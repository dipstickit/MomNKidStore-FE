import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MainAPI } from "../../API";
import { FaImage, FaPlus, FaArrowLeft } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './EditProduct.scss';


const validationSchema = Yup.object({
    productName: Yup.string().required("Product Name is required"),
    productInfor: Yup.string().required("Product Information is required"),
    productPrice: Yup.number()
        .positive("Product Price must be greater than 0")
        .required("Product Price is required"),
    productQuantity: Yup.number()
        .positive("Product Quantity must be greater than 0")
        .required("Product Quantity is required"),
    productCategoryId: Yup.number().required('Category is required'),
    images: Yup.array().min(1, "At least one image is required"),
    productStatus: Yup.string().required('Product status is required'),
});

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

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    const token = JSON.parse(localStorage.getItem('accessToken'));
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${MainAPI}/Product/get-product-by-id/${productId}`, {
                    headers: {
                        'x-access-token': token,
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProduct(response.data);

                const imageUrls = response.data.images.map(img => img.imageProduct1);
                setImagePreviews(imageUrls);

                formik.setValues({
                    productName: response.data.productName,
                    productInfor: response.data.productInfor,
                    productPrice: response.data.productPrice,
                    productQuantity: response.data.productQuantity,
                    productCategoryId: response.data.productCategoryId || '',
                    images: response.data.images.map(img => ({ imageProduct1: img.imageProduct1 })) || [],
                    productStatus: response.data.productStatus ? 'available' : 'unavailable',
                });
            } catch (error) {
                console.error('Error fetching product:', error);
                toast.error('Error fetching product.');
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${MainAPI}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories.');
            }
        };

        fetchProduct();
        fetchCategories();
    }, [productId]);

    const formik = useFormik({
        initialValues: {
            productName: '',
            productInfor: '',
            productPrice: 0,
            productQuantity: 0,
            productCategoryId: '',
            images: [],
            productStatus: 'available',
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const imageUrls = await Promise.all(values.images.map(async (file) => {
                    if (file instanceof File) {
                        const imageUrl = await uploadImageToCloudinary(file);
                        return imageUrl ? imageUrl : null;
                    }
                    return file.imageProduct1;
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
                    productStatus: values.productStatus === 'available',
                };

                if (!token) {
                    console.error("No access token found.");
                    toast.error("No access token found.");
                    return;
                }

                await axios.put(`${MainAPI}/Product/update-product/${productId}`, productPayload, {
                    headers: {
                        "x-access-token": token,
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success("Product updated successfully!");
                navigate("/staff/manage_product");
            } catch (error) {
                console.error('Error updating product:', error);
                toast.error('Error updating product.');
            }
        },
    });

    const handleImageChange = (event) => {
        const files = Array.from(event.currentTarget.files);
        const newImagePreviews = files.map(file => URL.createObjectURL(file));

        setImagePreviews(prev => [...prev, ...newImagePreviews]);
        formik.setFieldValue("images", files);
    };

    return (
        <div className="editProduct_container">
            <ToastContainer autoClose={2000} />
            <h1>Edit Product</h1>
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

                <div className="form-group">
                    <label htmlFor="productStatus">Status</label>
                    <select
                        id="productStatus"
                        name="productStatus"
                        value={formik.values.productStatus}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                    {formik.touched.productStatus && formik.errors.productStatus ? (
                        <div className="error">{formik.errors.productStatus}</div>
                    ) : null}
                </div>

                <button type="submit" className="btn submit-btn">
                    Update Product
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
    );
};

export default EditProduct;
