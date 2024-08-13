import React, { useEffect, useState } from "react";
import "./Blog.scss";
import HeaderPage from "../../utils/Header/Header";
import FooterPage from "../../utils/Footer/FooterPage";
import { Link } from "react-router-dom";
import { MainAPI } from "../API";
import axios from "axios";
import { Spinner } from "react-bootstrap";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainAPI}/Blog/GetAllBlog`)
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="blog-page-wrapper">
      <HeaderPage />

      <div className="blog-page" style={{ backgroundColor: "#f5f7fd" }}>
        {loading ? (
          <div className="text-center mt-5">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <div className="container blog-container">
            <div className="row">
              {blogs.map((blog) => (
                <div className="col-md-4 p-3" key={blog.blogId}>
                  <Link to={`post/${blog.blogId}`} className="link">
                    <div className="card content-card">
                      <div className="img-container mb-3">
                        {blog.blogImage ? (
                          <img src={blog.blogImage} alt={blog.blogTitle} />
                        ) : (
                          <img src="https://via.placeholder.com/150" alt="Placeholder" />
                        )}
                      </div>
                      <div className="content-container">
                        <h4>{blog.blogTitle}</h4>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <FooterPage />
    </div>
  );
}
