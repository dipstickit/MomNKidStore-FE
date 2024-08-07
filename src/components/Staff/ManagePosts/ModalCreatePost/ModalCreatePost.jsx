import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./CreatePost.scss";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dmyyf65yy/image/upload";
const PRODUCTS_API_URL = "http://54.151.230.5:5173/api/v1/Product/get-all-products";

const validationSchema = Yup.object({
  blogTitle: Yup.string().required("Title is required"),
  blogContent: Yup.string().required("Content is required"),
  blogImage: Yup.string().url("Invalid URL").nullable(),
  productId: Yup.number().required("Product ID is required"),
  status: Yup.string().oneOf(['active', 'inactive'], 'Invalid status').required("Status is required"),
});

const ModalCreatePost = () => {
  const navigate = useNavigate();
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    fetchProductOptions();
  }, []);

  const fetchProductOptions = async () => {
    try {
      const response = await axios.get(PRODUCTS_API_URL);
      const products = response.data.map(product => ({
        id: product.productId,
        name: product.productName,
      }));
      setProductOptions(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    }
  };

  const handleCreate = async (values) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));

    if (!token) {
      toast.error("No authorization token found.");
      return;
    }

    const payload = {
      blogTitle: values.blogTitle,
      blogContent: values.blogContent,
      blogImage: values.blogImage || "",
      status: values.status === 'active',
      productId: [Number(values.productId)],
    };

    try {
      await axios.post(
        "http://54.151.230.5:5173/api/Blog/createBlog",
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success("Blog created successfully.");
      navigate("/staff/manage_posts");
    } catch (error) {
      console.error("Error creating blog:", error.response ? error.response.data : error.message);
      toast.error("Failed to create blog.");
    }
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "fiverr");

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error.response ? error.response.data : error.message);
      toast.error("Failed to upload image.");
    }
  };

  return (
    <div className="create-post-container">
      <ToastContainer autoClose={2000} />
      <h1>Create New Blog</h1>
      <Formik
        initialValues={{
          blogTitle: "",
          blogContent: "",
          blogImage: "",
          status: "active",
          productId: "",
        }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setFieldValue }) => {
          if (values.blogImage instanceof File) {
            const imageUrl = await uploadImage(values.blogImage);
            setFieldValue("blogImage", imageUrl);
          }
          await handleCreate(values);
        }}
      >
        {({ setFieldValue }) => (
          <Form className="create-form">
            <label>
              Title:
              <Field
                type="text"
                name="blogTitle"
                className="form-field"
              />
              <ErrorMessage name="blogTitle" component="div" className="error" />
            </label>
            <label>
              Content:
              <Field
                as="textarea"
                name="blogContent"
                className="form-field"
              />
              <ErrorMessage name="blogContent" component="div" className="error" />
            </label>
            <label>
              Image:
              <input
                type="file"
                accept="image/*"
                onChange={async (event) => {
                  if (event.currentTarget.files.length > 0) {
                    const file = event.currentTarget.files[0];
                    const imageUrl = await uploadImage(file);
                    setFieldValue("blogImage", imageUrl);
                  }
                }}
                className="form-field"
              />
              <ErrorMessage name="blogImage" component="div" className="error" />
            </label>
            <label>
              Status:
              <Field as="select" name="status" className="form-field">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </Field>
              <ErrorMessage name="status" component="div" className="error" />
            </label>
            <label>
              Product:
              <Field as="select" name="productId" className="form-field">
                <option value="">Select a product</option>
                {productOptions.map(product => (
                  <option key={product.id} value={product.id}>
                    {product.id}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="productId" component="div" className="error" />
            </label>
            <div className="button-container">
              <button type="submit" className="save-button">Save</button>
              <button type="button" className="cancel-button" onClick={() => navigate("/staff/manage_posts")}>Cancel</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ModalCreatePost;
