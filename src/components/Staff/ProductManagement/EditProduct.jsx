import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MainAPI } from '../../API';
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
    images: Yup.array().of(
        Yup.object({
            imageProduct1: Yup.string().url('Invalid URL').required('Image URL is required')
        })
    ).optional(),
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
        return null;
    }
};

const EditProduct = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const token = JSON.parse(localStorage.getItem('accessToken'));
                const response = await axios.get(`${MainAPI}/Product/get-product-by-id/${productId}`, {
                    headers: {
                        'x-access-token': token,
                        Authorization: `Bearer ${token}`,
                    },
                });

                setProduct(response.data);
                const imageUrls = response.data.images.map(img => img.imageProduct1);
                setSelectedImages(imageUrls);

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
                toast.error('Error fetching product: ' + (error?.response?.data?.message || error.message));
            }
        };
        console.log("Selected Images:", selectedImages);

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${MainAPI}/categories`);
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Error fetching categories: ' + (error?.response?.data?.message || error.message));
            }
        };

        fetchProduct();
        fetchCategories();
    }, [productId]);

    const formik = useFormik({
        initialValues: {
            productName: '',
            productInfor: '',
            productPrice: '',
            productQuantity: '',
            productCategoryId: '',
            images: [],
            productStatus: 'available'
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const token = JSON.parse(localStorage.getItem('accessToken'));

                const imageUrls = await Promise.all(values.images.map(async (file) => {
                    if (file instanceof File) {
                        const imageUrl = await uploadImageToCloudinary(file);
                        return imageUrl ? imageUrl : null;
                    }
                    return file.imageProduct1;
                }));

                const imagesFormatted = imageUrls.filter(Boolean).map((url, index) => ({
                    "imageProduct1": url,
                }));

                const requestData = {
                    productCategoryId: Number(values.productCategoryId),
                    productName: values.productName,
                    productInfor: values.productInfor,
                    productPrice: values.productPrice,
                    productQuantity: values.productQuantity,
                    productStatus: values.productStatus === 'available',
                    images: imagesFormatted,
                };
                console.log(requestData);
                console.log("Image URLs:", imageUrls);
                await axios.put(`${MainAPI}/Product/update-product/${productId}`, requestData, {
                    headers: {
                        'x-access-token': token,
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                toast.success('Product updated successfully!');
                navigate('/staff/manage_product');
            } catch (error) {
                console.error('Error updating product:', error?.response?.data || error.message);
                toast.error('Error updating product: ' + (error?.response?.data?.message || error.message));
            }
        }
    });

    const handleImageChange = (event) => {
        const files = Array.from(event.currentTarget.files);
        const imagePreviews = files.map(file => URL.createObjectURL(file));

        setSelectedImages(imagePreviews);

        const fileObjects = files.map(file => ({
            imageProduct1: file
        }));
        formik.setFieldValue("images", fileObjects);
    };


    if (!product) return <div>Loading...</div>;

    return (
        <div className="edit-product-container">
            <button className="back-button" onClick={() => navigate(-1)}>Back</button>
            <h1>Edit Product</h1>
            <ToastContainer autoClose={2000} />
            <form onSubmit={formik.handleSubmit} className="edit-product-form">
                <div className="form-group">
                    <label htmlFor="productName">Product Name</label>
                    <input
                        id="productName"
                        name="productName"
                        type="text"
                        value={formik.values.productName || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.productName && formik.errors.productName ? (
                        <div className="error-message">{formik.errors.productName}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="productInfor">Product Information</label>
                    <input
                        id="productInfor"
                        name="productInfor"
                        type="text"
                        value={formik.values.productInfor || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.productInfor && formik.errors.productInfor ? (
                        <div className="error-message">{formik.errors.productInfor}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="productPrice">Product Price</label>
                    <input
                        id="productPrice"
                        name="productPrice"
                        type="number"
                        value={formik.values.productPrice || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.productPrice && formik.errors.productPrice ? (
                        <div className="error-message">{formik.errors.productPrice}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="productQuantity">Product Quantity</label>
                    <input
                        id="productQuantity"
                        name="productQuantity"
                        type="number"
                        value={formik.values.productQuantity || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.productQuantity && formik.errors.productQuantity ? (
                        <div className="error-message">{formik.errors.productQuantity}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="productCategoryId">Category</label>
                    <select
                        id="productCategoryId"
                        name="productCategoryId"
                        value={formik.values.productCategoryId || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.productCategoryId} value={category.productCategoryId}>{category.productCategoryName}</option>
                        ))}
                    </select>
                    {formik.touched.productCategoryId && formik.errors.productCategoryId ? (
                        <div className="error-message">{formik.errors.productCategoryId}</div>
                    ) : null}
                </div>

                <div className="form-group">
                    <label htmlFor="images">Images</label>
                    <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        onChange={handleImageChange}
                    />
                    {formik.touched.images && formik.errors.images ? (
                        <div className="error-message">{formik.errors.images}</div>
                    ) : null}
                </div>

                <div className="image-previews">
                    {selectedImages.map((img, index) => (
                        <img key={index} src={img} alt={`Preview ${index}`} />
                    ))}
                </div>
                {selectedImages.length > 0 && (
                    <div className="image-previews">
                        {selectedImages.map((image, index) => (
                            <img key={index} src={image} alt={`Preview ${index}`} />
                        ))}
                    </div>
                )}


                <div className="form-group">
                    <label htmlFor="productStatus">Status</label>
                    <select
                        id="productStatus"
                        name="productStatus"
                        value={formik.values.productStatus || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                    {formik.touched.productStatus && formik.errors.productStatus ? (
                        <div className="error-message">{formik.errors.productStatus}</div>
                    ) : null}
                </div>

                <button type="submit" className="submit-button">Update Product</button>
            </form>
        </div>
    );
};

export default EditProduct;
