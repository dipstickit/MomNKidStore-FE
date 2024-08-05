import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MainAPI } from '../../API';

export default function EditProduct() {
    const { id } = useParams();
    const nav = useNavigate();
    const [edit, setEdit] = useState({})

    const formik = useFormik({
        initialValues: {
            brandName: "",
            image: "",
            productName: "",
            price: "",
            countryID: "",
            description: "",
            ageRange: "",
        },
        onSubmit: (values) => {
            handleUpdateProduct(values);
        },
        validationSchema: Yup.object({
            productName: Yup.string()
                .required("Required.")
                .min(2, "Must be 2 characters or more"),
            description: Yup.string()
                .required("Required.")
                .min(2, "Must be 2 characters or more"),
            price: Yup.number().required("Required."),
            brandName: Yup.string().required("Required."),
            countryID: Yup.string().required("Required."),
            image: Yup.string().required("Required."),
            ageRange: Yup.string().required("Required."),
        }),
    });

    const fetchData = async () => {
        try {
            const response = await fetch(
                `${MainAPI}/product/getProById/${id}`,
                {
                    method: "GET",
                }
            );
            if (!response.ok) throw new Error("Failed to get data to edit");
            const data = await response.json();
            const product = data;
            setEdit(product);
            formik.setValues({
                brandName: product.brand_name,
                image: product.image_url,
                productName: product.product_name,
                price: product.price,
                countryID: product.country_id,
                description: product.description,
                ageRange: product.age_range,
            });

        } catch (error) {
            console.log("Error fetching product data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    console.log(edit);

    const handleUpdateProduct = async () => {
        try {
            const response = await fetch(`${MainAPI}/staff/update-product/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
                },
                body: JSON.stringify({
                    brand_name: formik.values.brandName,
                    image_url: formik.values.image,
                    product_name: formik.values.productName,
                    price: formik.values.price,
                    country_id: formik.values.countryID,
                    description: formik.values.description,
                    age_range: formik.values.ageRange,
                }),
            });
            if (!response.ok) throw new Error("Failed to update product");
            const data = await response.json();
            console.log(data);
            toast.success("Product updated successfully");
            setTimeout(() => {
                nav("/staff/manage_inventory");
            }, 2000);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const handleCancel = () => {
        nav("/staff/manage_inventory");
    }

    return (
        <div className="container mt-3">
            <ToastContainer />
            <div className="mx-2">
                <div className="card edit-voucher">
                    <div className="card-body">
                        <h4 className="card-title">Edit Product</h4>
                        <form onSubmit={formik.handleSubmit}>

                            <div className="mb-3">
                                <label htmlFor="img" className="form-label">Url_Image</label>
                                <input
                                    type="text"
                                    className={`form-control ${formik.touched.image && formik.errors.image ? 'is-invalid' : ''}`}
                                    id="image"
                                    name="image"
                                    value={formik.values.image}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.image && formik.errors.image && (
                                    <div className="invalid-feedback">
                                        {formik.errors.image}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Brand Name</label>
                                <select
                                    className={`form-control ${formik.touched.brandName && formik.errors.brandName ? 'is-invalid' : ''}`}
                                    id="brandName"
                                    name="brandName"
                                    value={formik.values.brandName}
                                    onChange={formik.handleChange}
                                >
                                    <option value="Yoko Gold"> Yoko Gold</option>
                                    <option value="Wakodo">  Wakodo</option>
                                    <option value="Vinamilk">Vinamilk</option>
                                    <option value="Vanma (Nutifood)">  Vanma (Nutifood)</option>
                                    <option value="Similac">Similac</option>
                                    <option value="Hikid">Hikid</option>
                                    <option value="Friso Gold Pro"> Friso Gold Pro</option>
                                    <option value="Fanma (Nutifood)">Fanma (Nutifood)</option>
                                    <option value="Enfamil">Enfamil</option>
                                    <option value="Bellamy">Bellamy</option>
                                    <option value="Aptamil">Aptamil</option>
                                    <option value="Abbot Grow">Abbot Grow</option>
                                    <option value="a2 Milk">a2 Milk</option>
                                    <option value="Ensure">Ensure</option>

                                </select>
                                {formik.touched.brandName && formik.errors.brandName && (
                                    <div className="invalid-feedback">
                                        {formik.errors.brandName}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="productName" className="form-label">Product Name</label>
                                <input
                                    type="text"
                                    className={`form-control ${formik.touched.productName && formik.errors.productName ? 'is-invalid' : ''}`}
                                    id="productName"
                                    name="productName"
                                    value={formik.values.productName}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.productName && formik.errors.productName && (
                                    <div className="invalid-feedback">
                                        {formik.errors.productName}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="price" className="form-label">Price</label>
                                <input
                                    type="number"
                                    className={`form-control ${formik.touched.price && formik.errors.price ? 'is-invalid' : ''}`}
                                    id="price"
                                    name="price"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.price && formik.errors.price && (
                                    <div className="invalid-feedback">
                                        {formik.errors.price}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="countryID" className="form-label">Country Name</label>
                                <select
                                    className={`form-control ${formik.touched.countryID && formik.errors.countryID ? 'is-invalid' : ''}`}
                                    id="countryID"
                                    name="countryID"
                                    value={formik.values.countryID}
                                    onChange={formik.handleChange}
                                >
                                    <option value="VNA">Việt Nam</option>
                                    <option value="NED">Hà Lan</option>
                                    <option value="KOR">Hàn Quốc</option>
                                    <option value="SWE">Thụy Điển</option>
                                    <option value="JPN">Nhật Bản</option>
                                    <option value="THL">Thái Lan</option>
                                    <option value="USA">Mỹ</option>
                                    <option value="GER">Đức</option>
                                    <option value="FRA">Pháp</option>
                                    <option value="IRE">Ireland</option>
                                </select>
                                {formik.touched.countryID && formik.errors.countryID && (
                                    <div className="invalid-feedback">
                                        {formik.errors.countryID}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="ageRange" className="form-label">Age Range</label>
                                <select
                                    className={`form-control ${formik.touched.ageRange && formik.errors.ageRange ? 'is-invalid' : ''}`}
                                    id="ageRange"
                                    name="ageRange"
                                    value={formik.values.ageRange}
                                    onChange={formik.handleChange}
                                >
                                    <option value="> 2 years old">&gt; 2 years old</option>
                                    <option value="0-1 year">0-1 year</option>
                                    <option value="1-2 years">1-2 years</option>
                                    <option value="Adult">Adult</option>
                                    <option value="Maternal">Maternal</option>
                                </select>
                                {formik.touched.ageRange && formik.errors.ageRange && (
                                    <div className="invalid-feedback">
                                        {formik.errors.ageRange}
                                    </div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="prodes" className="form-label">Description</label>
                                <textarea
                                    className={`form-control ${formik.touched.description && formik.errors.description ? 'is-invalid' : ''}`}
                                    id="description"
                                    name="description"
                                    value={formik.values.description}
                                    onChange={formik.handleChange}
                                />
                                {formik.touched.description && formik.errors.description && (
                                    <div className="invalid-feedback">
                                        {formik.errors.description}
                                    </div>
                                )}
                            </div>

                            <div className="mt-3">
                                <button type="submit" className="btn btn-primary me-2">
                                    Update
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => handleCancel()}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

