import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdModeEdit } from "react-icons/md";
import "./ProductManagement.scss";
import { DeleteIcon } from "../../../utils/Icon/DeleteIcon";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";

export default function UserManagement() {
  const nav = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCategoryName = async (categoryId) => {
    try {
      const response = await axios.get(
        `${MainAPI}/ProductCategory/${categoryId}`
      );
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

  const handleDelete = async (id) => {
    try {
      const response = await axios.get(`${MainAPI}/admin/delete/${id}`, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      });
      fetchData();
      toast.success(response.data.message);
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.productName.localeCompare(b.productName));

  const columns = [
    {
      name: "ID",
      selector: (row) => row.productId,
      sortable: true,
    },
    {
      name: "Category Name",
      selector: (row) => row.categoryName || "Loading...",
    },
    {
      name: "Name",
      selector: (row) => row.productName,
      sortable: true,
    },
    {
      name: "Information",
      selector: (row) => row.productInfor,
    },
    {
      name: "Price",
      selector: (row) => row.productPrice,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.productQuantity,
      sortable: true,
    },
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
          <span
            className="action-btn"
            onClick={() => {
              handleDelete(row.productId);
            }}
          >
            <DeleteIcon color="red" />
          </span>
          <span
            className="action-btn"
            onClick={() => {
              nav(`/admin/edit/${row.productId}`);
            }}
          >
            <MdModeEdit color="green" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="userManage_container">
      <div className="content">
        <ToastContainer autoClose={2000} />
        <h1 className="mt-0">Product Management</h1>
        <div className="user_manage mt-4">
          <div className="search">
            <label htmlFor="searchInput">Search: </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query
            />
          </div>
          <div className="button-group">
            <button
              className="btn add-btn"
              onClick={() => {
                nav("/admin/create");
              }}
            >
              Add Product
            </button>
            <button
              className="btn back-btn"
              onClick={() => {
                nav("/admin");
              }}
            >
              Back to Admin
            </button>
          </div>
        </div>
        <div className="table mt-3">
          <DataTable
            columns={columns}
            data={filteredProducts}
            selectableRows
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10]}
            className="table-content"
          />
        </div>
      </div>
    </div>
  );
}
