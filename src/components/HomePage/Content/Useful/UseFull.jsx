import React, { useEffect, useState } from "react";
import "./UseFull.scss";
import { listUsefull } from "./UsefullList";
import { FaRegEye } from "react-icons/fa";
import { IoIosArrowDropright } from "react-icons/io";
import { Link } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../../API";
import { convertSQLDate } from "../../../../utils/Format";

export default function UseFull() {
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    axios
      .get(`${MainAPI}/user/show-top-4-post`)
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
          <h2 style={{ marginBottom: "20px" }}>Thông tin bổ ích</h2>
          <span>
            <Link
              to={"/blogs"}
              style={{
                textDecoration: "none",
                color: "FF3E9F",
              }}
            >
              Xem tất cả <IoIosArrowDropright />
            </Link>
          </span>
        </div>
        <div className="usefull_container ">
          {blogs.map((usefull) => {
            return (
              <Link
                to={`/blogs/post/${usefull.post_id}`}
                className="usefull_detail"
                key={usefull.post_id}
              >
                <div className="usefull-img-container">
                  <img src={usefull.image_url} />
                </div>
                <p
                  className="fw-bold mt-2"
                  style={{ lineHeight: "17px", fontSize: "14px" }}
                >
                  {usefull.title}
                </p>
                <p className="mt-auto d-flex justify-content-between">
                  <span> {convertSQLDate(usefull.post_date)}</span>
                  <span className="fs-5">
                    <IoIosArrowDropright />
                  </span>
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
