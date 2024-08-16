import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdModeEdit } from "react-icons/md";
import { DeleteIcon } from "../../../utils/Icon/DeleteIcon";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "./ManagePost.scss";

export default function ManagePosts() {
  const nav = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${MainAPI}/Blog/GetAllBlog`);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blog data:", error);
      toast.error("Error fetching blog data.");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = (blog) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${blog.blogTitle}"?`,
      customUI: ({ onClose }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <h1>Confirm Deletion</h1>
          <p>Are you sure you want to delete "{blog.blogTitle}"?</p>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${MainAPI}/Blog/delete-blog/${blog.blogId}`, {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    }
                  });
                  toast.success("Blog deleted successfully");
                  fetchBlogs();
                } catch (error) {
                  console.error("Error deleting blog:", error);
                  toast.error("Error deleting blog.");
                }
                onClose();
              }}
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 40px',
                fontSize: '1rem',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              Yes
            </button>
            <button
              onClick={onClose}
              style={{
                backgroundColor: '#dc3545',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                padding: '8px 40px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              No
            </button>
          </div>
        </div>
      )
    });
  };

  const filteredBlogs = blogs.filter((blog) =>
    blog.blogTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { name: "ID", selector: (row) => row.blogId, sortable: true },
    { name: "Title", selector: (row) => row.blogTitle, sortable: true },
    { name: "Content", selector: (row) => row.blogContent },
    { name: "Status", selector: (row) => (row.status ? "Active" : "Inactive") },
    {
      name: "Image",
      cell: (row) => (
        row.blogImage ? <img src={row.blogImage} alt={row.blogTitle} style={{ width: '100px', height: 'auto', borderRadius: '5px' }} /> : 'No Image'
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action">
          <span className="action-btn" onClick={() => handleDelete(row)}>
            <DeleteIcon color="red" />
          </span>
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
