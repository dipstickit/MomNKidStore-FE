import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";
import "./ManagePost.scss";

export default function ManagePosts() {
  const nav = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = JSON.parse(localStorage.getItem("accessToken"));
  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${MainAPI}/Blog/GetBlogInStaffPage`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blog data:", error);
      toast.error("Error fetching blog data.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleStatusToggle = async (blogId, currentStatus) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    try {
      await axios.put(
        `${MainAPI}/Blog/updateBlogStatus/${blogId}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      toast.success("Blog status updated successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Error updating blog status:", error);
      toast.error("Error updating blog status.");
    }
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.blogTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { name: "ID", selector: (row) => row.blogId, sortable: true },
    { name: "Title", selector: (row) => row.blogTitle, sortable: true },
    { name: "Content", selector: (row) => row.blogContent },
    {
      name: "Status",
      cell: (row) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.status}
            onChange={() => handleStatusToggle(row.blogId, row.status)}
          />
          <span className="slider round"></span>
        </label>
      ),
    },
    {
      name: "Image",
      cell: (row) =>
        row.blogImage ? (
          <img
            src={row.blogImage}
            alt={row.blogTitle}
            style={{ width: "100px", height: "auto", borderRadius: "5px" }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action">
          <span className="action-btn" onClick={() => nav(`/edit-blog/${row.blogId}`)}>
            <MdModeEdit color="green" />
          </span>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="blogManagement-container">
      <div className="content">
        <h1>Blog Management</h1>
        <div className="blog-management">
          <div className="search">
            <label htmlFor="searchInput">Search: </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button className="btn add-btn" onClick={() => nav("/create-blog")}>
              Add Blog
            </button>
          </div>
        </div>
        <div className="table">
          <DataTable
            columns={columns}
            data={filteredBlogs}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80]}
          />
        </div>
      </div>
    </div>
  );
}
