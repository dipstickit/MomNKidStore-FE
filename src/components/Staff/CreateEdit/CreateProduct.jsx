/* eslint-disable no-extra-semi */
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MainAPI } from "../../API";

export default function EditProduct() {
  const nav = useNavigate();

  const formik = useFormik({
    initialValues: {
      brandName: "",
      image: "",
      productName: "",
      price: "",
      countryID: "",
      description: "",
      ageRange: "",
      proDate: "",
      expDate: "",
      stock: "",
    },
    onSubmit: (values) => {
      handleAddProduct();
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
      proDate: Yup.string().required("Required."),
      expDate: Yup.string().required("Required."),
      stock: Yup.number()
        .required("Required.")
        .min(0, "Must be greater than 0"),
    }),
  });

  const handleAddProduct = async () => {
    try {
      const response = await fetch(`${MainAPI}/staff/add-product`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
        body: JSON.stringify({
          brand_id: formik.values.brandName,
          image_url: formik.values.image,
          product_name: formik.values.productName,
          price: formik.values.price,
          country_id: formik.values.countryID,
          description: formik.values.description,
          age_range: formik.values.ageRange,
          expiration_date: formik.values.expDate,
          production_date: formik.values.proDate,
          stock: formik.values.stock,
        }),
      });
      const data = await response.json();
      if (data.status === 200) {
        toast.success("Product add successfully");
        setTimeout(() => {
          nav("/staff/manage_inventory");
        }, 2000);
      } else {
        toast.error(data.errors[0].message);
      }
    } catch (error) {
      console.error("Error add product:", error);
    }
  };

  const handleCancel = () => {
    nav("/staff/manage_inventory");
  };

  return (
    <div className="container mt-3">
      <ToastContainer />
      <div className="mx-2">
        <div className="card edit-voucher">
          <div className="card-body">
            <h4 className="card-title">Add New Product</h4>
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label htmlFor="img" className="form-label">
                  Url_Image
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.image && formik.errors.image
                      ? "is-invalid"
                      : ""
                  }`}
                  id="image"
                  name="image"
                  value={formik.values.image}
                  onChange={formik.handleChange}
                />
                {formik.touched.image && formik.errors.image && (
                  <div className="invalid-feedback">{formik.errors.image}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Brand Name</label>
                <select
                  className={`form-control ${
                    formik.touched.brandName && formik.errors.brandName
                      ? "is-invalid"
                      : ""
                  }`}
                  id="brandName"
                  name="brandName"
                  value={formik.values.brandName}
                  onChange={formik.handleChange}
                >
                  <option value="" disabled>
                    -- Select Brand Name --
                  </option>
                  <option value="1">Yoko Gold</option>
                  <option value="2">Wakodo</option>
                  <option value="3">Vinamilk</option>
                  <option value="4">Vanma (Nutifood)</option>
                  <option value="5">Similac</option>
                  <option value="6">Hikid</option>
                  <option value="6">Friso Gold Pro</option>
                  <option value="8">Fanma (Nutifood)</option>
                  <option value="9">Enfamil</option>
                  <option value="10">Bellamy</option>
                  <option value="11">Aptamil</option>
                  <option value="12">Abbot Grow</option>
                  <option value="13">a2 Milk</option>
                  <option value="14">Ensure</option>
                </select>
                {formik.touched.brandName && formik.errors.brandName && (
                  <div className="invalid-feedback">
                    {formik.errors.brandName}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="productName" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    formik.touched.productName && formik.errors.productName
                      ? "is-invalid"
                      : ""
                  }`}
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
                <label htmlFor="price" className="form-label">
                  Price
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    formik.touched.price && formik.errors.price
                      ? "is-invalid"
                      : ""
                  }`}
                  id="price"
                  name="price"
                  value={formik.values.price}
                  onChange={formik.handleChange}
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="invalid-feedback">{formik.errors.price}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="price" className="form-label">
                  Stock
                </label>
                <input
                  type="number"
                  className={`form-control ${
                    formik.touched.stock && formik.errors.stock
                      ? "is-invalid"
                      : ""
                  }`}
                  id="stock"
                  name="stock"
                  value={formik.values.stock}
                  onChange={formik.handleChange}
                />
                {formik.touched.stock && formik.errors.stock && (
                  <div className="invalid-feedback">{formik.errors.stock}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="countryID" className="form-label">
                  Country Name
                </label>
                <select
                  className={`form-control ${
                    formik.touched.countryID && formik.errors.countryID
                      ? "is-invalid"
                      : ""
                  }`}
                  id="countryID"
                  name="countryID"
                  value={formik.values.countryID}
                  onChange={formik.handleChange}
                >
                  <option value="" disabled>
                    -- Select Country --
                  </option>
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
                <label htmlFor="ageRange" className="form-label">
                  Age Range
                </label>
                <select
                  className={`form-control ${
                    formik.touched.ageRange && formik.errors.ageRange
                      ? "is-invalid"
                      : ""
                  }`}
                  id="ageRange"
                  name="ageRange"
                  value={formik.values.ageRange}
                  onChange={formik.handleChange}
                >
                  <option value="" disabled>
                    -- Select Age Range --
                  </option>
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
                <label htmlFor="prodes" className="form-label">
                  Description
                </label>
                <textarea
                  className={`form-control ${
                    formik.touched.description && formik.errors.description
                      ? "is-invalid"
                      : ""
                  }`}
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

              <div className="mb-3">
                <label htmlFor="proDate" className="form-label">
                  Production Date
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.proDate && formik.errors.proDate
                      ? "is-invalid"
                      : ""
                  }`}
                  id="proDate"
                  name="proDate"
                  value={formik.values.proDate}
                  onChange={formik.handleChange}
                />
                {formik.touched.proDate && formik.errors.proDate && (
                  <div className="invalid-feedback">
                    {formik.errors.proDate}
                  </div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="expDate" className="form-label">
                  Expiration Date
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    formik.touched.expDate && formik.errors.expDate
                      ? "is-invalid"
                      : ""
                  }`}
                  id="expDate"
                  name="expDate"
                  value={formik.values.expDate}
                  onChange={formik.handleChange}
                />
                {formik.touched.expDate && formik.errors.expDate && (
                  <div className="invalid-feedback">
                    {formik.errors.expDate}
                  </div>
                )}
              </div>

              <div className="mt-3">
                <button type="submit" className="btn btn-primary me-2">
                  Add New Product
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleCancel()}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
