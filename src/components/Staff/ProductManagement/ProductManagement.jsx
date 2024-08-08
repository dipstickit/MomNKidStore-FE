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
import "./ProductManagement.scss";

export default function UserManagement() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(`${MainAPI}/ProductCategory/${categoryId}`);
      return response.data.productCategoryName;
    } catch (error) {
      console.error(`Error fetching category name for ID ${categoryId}:`, error);
      return "Unknown Category";
    }
  };

  const fetchCategories = async (productList) => {
    const categoryMap = {};
    const categoryFetchPromises = [];

    productList.forEach((product) => {
      if (!categories[product.productCategoryId]) {
        categoryFetchPromises.push(
          fetchCategoryName(product.productCategoryId).then((name) => {
            categoryMap[product.productCategoryId] = name;
          })
        );
      } else {
        categoryMap[product.productCategoryId] = categories[product.productCategoryId];
      }
    });

    await Promise.all(categoryFetchPromises);
    setCategories((prevCategories) => ({ ...prevCategories, ...categoryMap }));
    return categoryMap;
  };

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (!token) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await axios.get(`${MainAPI}/Product/get-all-products`, {
        headers: {
          "x-access-token": token,
          Authorization: `Bearer ${token}`,
        },
      });

      const categoryMap = await fetchCategories(response.data);

      const productsWithCategories = response.data.map((product) => ({
        ...product,
        categoryName: categoryMap[product.productCategoryId] || "Loading...",
      }));

      setProducts(productsWithCategories);
    } catch (error) {
      console.error("Error fetching product data:", error);
      if (error.response) {
        switch (error.response.status) {
          case 401:
            toast.error("Unauthorized request. Check your token.");
            break;
          case 403:
            toast.error("Forbidden request. You don't have permission.");
            break;
          default:
            toast.error(`Unexpected error: ${error.response.status}`);
        }
      } else {
        toast.error("Network error or no response from server.");
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (product) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    confirmAlert({
      title: 'Confirm Deletion',
      message: `Are you sure you want to delete "${product.productName}"?`, // Use product.productName here
      customUI: ({ onClose }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
          <h1>Confirm Deletion</h1>
          <p>Are you sure you want to delete "{product.productName}"?</p> {/* Ensure productName is used here */}
          <div style={{ display: 'flex', marginTop: '20px' }}>
            <button
              onClick={async () => {
                try {
                  await axios.delete(`${MainAPI}/Product/delete-product/${product.productId}`, {
                    headers: {
                      "Content-Type": "application/json",
                      "Authorization": `Bearer ${token}`
                    }
                  });
                  toast.success("Product deleted successfully");
                  fetchData();
                } catch (error) {
                  console.error("Error deleting product:", error);
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


  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { name: "ID", selector: (row) => row.productId, sortable: true },
    { name: "Category Name", selector: (row) => row.categoryName },
    { name: "Name", selector: (row) => row.productName, sortable: true },
    { name: "Information", selector: (row) => row.productInfor },
    { name: "Price", selector: (row) => row.productPrice, sortable: true },
    { name: "Quantity", selector: (row) => row.productQuatity, sortable: true },
    {
      name: "Status",
      selector: (row) => (row.productStatus ? "Available" : "Unavailable"),
    },
    {
      name: "Images",
      selector: (row) => row.images.length,
      sortable: true,
      cell: (row) => (
        <div>
          {row.images.map((img, index) => (
            <img key={index} src={img} alt={`Product ${index}`} width={50} />
          ))}
        </div>
      ),
    },
    {
      cell: (row) => (
        <div className="action">
          <span className="action-btn" onClick={() => handleDelete(row)}>
            <DeleteIcon color="red" />
          </span>
          <span className="action-btn" onClick={() => nav(`/edit-product/${row.productId}`)}>
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
    <div className="userManagement-container">
      <div className="content">
        <ToastContainer autoClose={2000} />
        <h1>Product Management</h1>
        <div className="user-management">
          <div className="search">
            <label htmlFor="searchInput">Search: </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="button-group">
            <button className="btn add-btn" onClick={() => nav("/create-product")}>
              Add Product
            </button>
          </div>
        </div>
        <div className="table">
          <DataTable
            columns={columns}
            data={filteredProducts}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10]}
          />
        </div>
      </div>
    </div>
  );
}
