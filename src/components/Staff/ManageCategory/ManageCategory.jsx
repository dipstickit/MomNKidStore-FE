import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import "./ManageCategory.scss";

export default function ManageCategory() {
  const [categories, setCategories] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (!token) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await axios.get(`${MainAPI}/categories`, {
        headers: {
          "x-access-token": token,
          "Authorization": `Bearer ${token}`
        },
      });
      setCategories(response.data);
      console.log("Categories:", response.data);
    } catch (error) {
      console.error("Error fetching data categories:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            console.error("Unauthorized request. Check your token.");
            break;
          case 403:
            console.error("Forbidden request. You don't have permission.");
            break;
          default:
            console.error(`Unexpected error: ${error.response.status}`);
        }
      } else {
        console.error("Network error or no response from server.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCategory = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (!token) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    if (categories.some(category => category.productCategoryName.toLowerCase() === categoryName.toLowerCase())) {
      toast.error("Category name already exists. Please choose a different name.");
      return;
    }

    try {
      const response = await axios.post(
        `${MainAPI}/ProductCategory`,
        { productCategoryName: categoryName },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      console.log("Add Category Response:", response.data);

      fetchData();
      setShowAdd(false);
      setCategoryName("");
      toast.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error("Unauthorized request. Please check your credentials.");
            break;
          case 403:
            toast.error("Forbidden request. You don't have permission.");
            break;
          default:
            toast.error("An error occurred. Please try again later.");
        }
      } else {
        toast.error("Network error or no response from server.");
      }
    }
  };

  const handleEditCategory = (categoryId) => {
    console.log("Update category with ID:", categoryId);
    navigate(`/edit-category/${categoryId}`);
  };

  const handleDeleteCategory = (categoryId) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (!token) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    const category = categories.find(cat => cat.productCategoryId === categoryId);

    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${category ? category.productCategoryName : ''}"?`,
      customUI: ({ onClose }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <h1>Confirm Deletion</h1>
          <p>Are you sure you want to delete "{category ? category.productCategoryName : ''}"?</p>
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${MainAPI}/ProductCategory/${categoryId}`, {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    }
                  });
                  toast.success("Category deleted successfully");
                  fetchData();
                } catch (error) {
                  console.error("Error deleting category:", error);
                  if (error.response) {
                    switch (error.response.status) {
                      case 401:
                        toast.error("Unauthorized request. Please check your credentials.");
                        break;
                      case 403:
                        toast.error("Forbidden request. You don't have permission.");
                        break;
                      default:
                        toast.error("An error occurred. Please try again later.");
                    }
                  } else {
                    toast.error("Network error or no response from server.");
                  }
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

  return (
    <>
      <ToastContainer />
      <div className="manage-category-btn">
        <button
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
        >
          Create Category
        </button>
      </div>
      <div className="category">
        {showAdd && (
          <div className="add-category" style={{ marginLeft: "10px", textAlign: 'left' }}>
            <div className="add-category-detail">
              <h4 style={{ marginLeft: '10px' }}>Create Category</h4>
              <label className="category-name">Category Name:</label>
              <input
                type="text"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
              />
              &nbsp;&nbsp;&nbsp;
              <button className="add-cancel" onClick={handleAddCategory}>
                Create
              </button>
              <button className="add-cancel" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="category-th">
          <table className="table-category-th">
            <thead>
              <tr>
                <th>Category ID</th>
                <th>Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="category-tb">
          <table className="table-category-tb">
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.productCategoryId}>
                    <td>{category.productCategoryId}</td>
                    <td>{category.productCategoryName}</td>
                    <td>
                      <button onClick={() => handleEditCategory(category.productCategoryId)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteCategory(category.productCategoryId)}>
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    No categories available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
