import React, { useEffect, useState } from "react";
import "./UseFull.scss";
import { Link } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../../API";
import { IoIosArrowDropright } from "react-icons/io";

export default function UseFull() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get(`${MainAPI}/Blog/GetAllBlog`)
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div style={{ marginTop: "2%" }}>
      <div className="use_container">
        <div className="d-flex justify-content-between align-center">
          <h2 style={{ marginBottom: "20px" }}>Blog</h2>
          <span>
            <Link
              to={"/blogs"}
              style={{
                textDecoration: "none",
                color: "#FF3E9F",
              }}
            >
              View all <IoIosArrowDropright />
            </Link>
          </span>
        </div>
        <div className="usefull_container ">
          {blogs.map((usefull) => (
            <Link
              to={`/blogs/post/${usefull.blogId}`}
              className="usefull_detail"
              key={usefull.blogId}
            >
              <div className="usefull-img-container">
                <img
                  src={usefull.blogImage || "https://via.placeholder.com/150"}
                  alt={usefull.blogTitle}
                />
              </div>
              <p
                className="fw-bold mt-2"
                style={{ lineHeight: "17px", fontSize: "14px" }}
              >
                {usefull.blogTitle}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}