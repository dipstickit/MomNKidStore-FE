import React, { useEffect, useState } from "react";
import "./Voucher.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ManageVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [exDate, setExDate] = useState("");
  const [voucherValue, setVoucherValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Track the current page
  const pageSize = 10; // Number of vouchers per page

  const navigate = useNavigate();

  const fetchData = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (!token) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await axios.get(`${MainAPI}/VoucherOfShop/staff`, {
        headers: {
          "x-access-token": token,
          "Authorization": `Bearer ${token}`
        },
      });

      setVouchers(response.data); // Assuming response.data is the array of vouchers
      console.log("Vouchers:", response.data);
    } catch (error) {
      console.error("Error fetching data voucher:", error);
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

  const handleAddVoucher = async () => {
    if (!voucherValue || !quantity || !startDate || !exDate) {
      toast.error("Please fill in all fields before creating a voucher.");
      return;
    }
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (!token) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    try {
      const response = await axios.post(
        `${MainAPI}/VoucherOfShop`,
        {
          voucherValue: Number(voucherValue),
          voucherQuantity: Number(quantity),
          startDate: startDate,
          endDate: exDate
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      if (response.data.status === 200) {
        fetchData();
        setShowAdd(false);
        setExDate("");
        setVoucherValue("");
        setQuantity("");
        setStartDate("");
        toast.success("Voucher added successfully");
      } else {
        if (response.data.errors && Array.isArray(response.data.errors)) {
          toast.error(response.data.errors[0]?.message || "An error occurred. Please try again.");
        } else {
          toast.error("An error occurred. Please try again later.");
        }
      }
    } catch (error) {
      console.error("Error adding voucher:", error);
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

  const handleEditVoucher = async (voucherId) => {
    navigate(`/edit-voucher/${voucherId}`);
  };

  const handleDeleteVoucher = async (voucherId) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    if (!token) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    try {
      await axios.delete(`${MainAPI}/VoucherOfShop/${voucherId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      toast.success("Voucher deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting voucher:", error);
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

  // Pagination logic
  const totalPages = Math.ceil(vouchers.length / pageSize);

  const currentVouchers = vouchers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <ToastContainer />
      <div className="manage-voucher-container">
        <div className="content">
          <h1>Voucher Management</h1>
          <div className="voucher-management">
            <div className="create-voucher-btn">
              <button className="btn add-btn" onClick={() => setShowAdd(true)}>
                Create Voucher
              </button>
            </div>
          </div>

          {showAdd && (
            <div className="add-voucher">
              <h4>Create Voucher</h4>
              <div className="add-voucher-detail">
                <label>Voucher Value:</label>
                <input
                  type="number"
                  value={voucherValue}
                  onChange={(event) => setVoucherValue(event.target.value)}
                />
                <label>Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(event) => setStartDate(event.target.value)}
                />
                <label>Expiration Date:</label>
                <input
                  type="date"
                  value={exDate}
                  onChange={(event) => setExDate(event.target.value)}
                />
                <label>Quantity:</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                />
                <div className="btn-group">
                  <button className="btn create-btn" onClick={handleAddVoucher}>
                    Create
                  </button>
                  <button className="btn cancel-btn" onClick={() => setShowAdd(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="voucher-table">
            <table>
              <thead>
                <tr>
                  <th>Voucher ID</th>
                  <th>Voucher Value</th>
                  <th>Quantity</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentVouchers.length > 0 ? (
                  currentVouchers.map((voucher) => (
                    <tr key={voucher.voucherId}>
                      <td>{voucher.voucherId}</td>
                      <td>{voucher.voucherValue}</td>
                      <td>{voucher.voucherQuantity}</td>
                      <td>{voucher.startDate}</td>
                      <td>{voucher.endDate}</td>
                      <td>
                        <button className="action-btn" onClick={() => handleEditVoucher(voucher.voucherId)}>
                          <FaEdit />
                        </button>
                        <button className="action-btn" onClick={() => handleDeleteVoucher(voucher.voucherId)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center' }}>
                      No vouchers available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              className="btn page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`btn page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
            <button
              className="btn page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
