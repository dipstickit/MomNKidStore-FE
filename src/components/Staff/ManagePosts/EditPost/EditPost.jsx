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
import NavbarStaff from "../../NavBar/NavBarStaff";

const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/dmyyf65yy/image/upload";

const validationSchema = Yup.object({
  blogTitle: Yup.string().required("Title is required"),
  blogContent: Yup.string().required("Content is required"),
  blogImage: Yup.string().url("Invalid URL").nullable(),
  productId: Yup.array().min(1, "At least one product must be selected").required("Product ID is required"),
});

const EditPost = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [productOptions, setProductOptions] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      await fetchProductOptions();
      await fetchBlogDetails();
    };

    loadInitialData();
  }, [blogId]);

  const fetchBlogDetails = async () => {
    try {
      const response = await axios.get(`${MainAPI}/Blog/GetAllBlogByBlogId/${blogId}`);
      const blogData = response.data;

      setBlog(blogData);

      if (blogData && Array.isArray(blogData.productId)) {
        const selected = blogData.productId.map(productId => {
          const product = productOptions.find(p => p.id === productId);
          return product || { id: productId, name: `Product ${productId}` };
        });
        setSelectedProducts(selected);
      } else {
        setSelectedProducts([]);
      }
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
      productId: selectedProducts.map(p => p.id),
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

  const handleProductSelect = (product) => {
    if (!selectedProducts.some(p => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleProductRemove = (id) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== id));
  };

  return (
    <div className="layout-container">
      <NavbarStaff />
      <div className="content-container">
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
                    productId: selectedProducts.map(product => product.id),
                  }}
                  validationSchema={validationSchema}
                  onSubmit={async (values) => {
                    if (values.blogImage instanceof File) {
                      const imageUrl = await uploadImage(values.blogImage);
                      values.blogImage = imageUrl;
                    }
                    await handleUpdate(values);
                  }}
                >
                  {({ setFieldValue, values }) => {
                    // Đồng bộ selectedProducts với productId trong Formik
                    useEffect(() => {
                      setFieldValue("productId", selectedProducts.map(product => product.id));
                    }, [selectedProducts, setFieldValue]);

                    return (
                      <Form className="edit-form">
                        <div className="form-group">
                          <label htmlFor="blogTitle">Title:</label>
                          <Field
                            type="text"
                            name="blogTitle"
                            id="blogTitle"
                            className="form-field"
                          />
                          <ErrorMessage name="blogTitle" component="div" className="error" />
                        </div>

                        <div className="form-group">
                          <label htmlFor="blogContent">Content:</label>
                          <Field
                            as="textarea"
                            name="blogContent"
                            id="blogContent"
                            className="form-field"
                          />
                          <ErrorMessage name="blogContent" component="div" className="error" />
                        </div>

                        <div className="form-group">
                          <label htmlFor="blogImage">Image:</label>
                          <input
                            type="file"
                            accept="image/*"
                            id="blogImage"
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
                        </div>

                        <div className="form-group">
                          <label htmlFor="productId">Product:</label>
                          <div className="dropdown">
                            <button type="button" className="dropdown-button full-width-button">
                              Select Products
                            </button>

                            <div className="dropdown-content">
                              {productOptions.map(product => (
                                <div
                                  key={product.id}
                                  className="dropdown-item"
                                  onClick={() => handleProductSelect(product)}
                                >
                                  {product.name}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="selected-products">
                            {selectedProducts.map(product => (
                              <div key={product.id} className="selected-product">
                                {product.name}
                                <button type="button" onClick={() => handleProductRemove(product.id)}>
                                  Remove
                                </button>
                              </div>
                            ))}
                          </div>
                          <ErrorMessage name="productId" component="div" className="error" />
                        </div>

                        <div className="button-container">
                          <button type="submit" className="save-button">
                            <FaSave /> Save
                          </button>
                          <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                      </Form>
                    );
                  }}
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
      </div>
    </div>
  );
};

export default EditPost;
