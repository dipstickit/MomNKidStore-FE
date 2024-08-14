import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./EditPost.scss";
import { MainAPI } from "../../../API";
import { FaArrowLeft, FaSave } from "react-icons/fa";


const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dmyyf65yy/image/upload";

// Validation schema
const validationSchema = Yup.object({
  blogTitle: Yup.string().required("Title is required"),
  blogContent: Yup.string().required("Content is required"),
  blogImage: Yup.string().url("Invalid URL").nullable(),
  productId: Yup.number().required("Product ID is required"),
});

const EditPost = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productOptions, setProductOptions] = useState([]);

  useEffect(() => {
    fetchBlogDetails();
    fetchProductOptions();
  }, [blogId]);


  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`${MainAPI}/Blog/GetAllBlogByBlogId/${blogId}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Failed to fetch blog details.");
    }
  };


  const fetchProductOptions = async () => {
    try {
      const response = await axios.get(`${MainAPI}/Product/get-all-products`);
      const products = response.data.productList.map(product => ({
        id: product.productId,
        name: product.productName,
      }));
      setProductOptions(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to fetch products.");
    }
  };


  const handleUpdate = async (values) => {
    const token = JSON.parse(localStorage.getItem('accessToken'));

    if (!token) {
      toast.error("No authorization token found.");
      return;
    }


    const payload = {
      blogTitle: values.blogTitle,
      blogContent: values.blogContent,
      blogImage: values.blogImage || "",
      status: true,
      productId: [Number(values.productId)],
    };

    try {
      await axios.put(
        `${MainAPI}/Blog/updateBlog/${blogId}`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success("Blog updated successfully.");
      setIsEditing(false);
      fetchBlogDetails();
    } catch (error) {
      console.error("Error updating blog:", error.response ? error.response.data : error.message);
      toast.error("Failed to update blog.");
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
    <div className="blog-detail-container">
      <button className="back-button" onClick={() => navigate('/staff/manage_posts')}>
        <FaArrowLeft /> Back to Manage Blog
      </button>
      {blog ? (
        <div className="blog-detail">
          <h1>{isEditing ? "Edit Blog" : blog.blogTitle}</h1>
          {isEditing ? (
            <Formik
              initialValues={{
                blogTitle: blog.blogTitle,
                blogContent: blog.blogContent,
                blogImage: blog.blogImage || "",
                productId: blog.productId ? blog.productId[0] : "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setFieldValue }) => {
                if (values.blogImage instanceof File) {
                  const imageUrl = await uploadImage(values.blogImage);
                  setFieldValue("blogImage", imageUrl);
                }
                await handleUpdate(values);
              }}
            >
              {({ setFieldValue }) => (
                <Form className="edit-form">
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
                    Product:
                    <Field as="select" name="productId" className="form-field">
                      <option value="">Select a product</option>
                      {productOptions.map(product => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="productId" component="div" className="error" />
                  </label>
                  <div className="button-container">
                    <button type="submit" className="save-button"> <FaSave /> Save</button>
                    <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </Form>

              )}
            </Formik>
          ) : (
            <div className="blog-content">
              <p>{blog.blogContent}</p>
              {blog.blogImage && <img src={blog.blogImage} alt={blog.blogTitle} />}
              <button onClick={() => setIsEditing(true)}>Edit</button>
            </div>
          )}
        </div>
      ) : (
        <p>Loading blog details...</p>
      )}
    </div>
  );
};

export default EditPost;
