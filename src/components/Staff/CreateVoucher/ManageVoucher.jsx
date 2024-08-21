import React, { useEffect, useState } from "react";
import "./Voucher.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdModeEdit } from "react-icons/md";
import { DeleteIcon } from "../../../utils/Icon/DeleteIcon";
import * as Yup from "yup";

export default function ManageVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [exDate, setExDate] = useState("");
  const [voucherValue, setVoucherValue] = useState("");
  const [quantity, setQuantity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortType, setSortType] = useState("newest");
  const pageSize = 10;
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("accessToken"));

  const fetchData = async () => {

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

      setVouchers(response.data);
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

  const voucherSchema = Yup.object().shape({
    voucherValue: Yup.number()
      .positive("Voucher value must be greater than 0")
      .required("Voucher value is required"),
    quantity: Yup.number()
      .positive("Quantity must be greater than 0")
      .required("Quantity is required"),
    startDate: Yup.date()
      .min(new Date().toISOString().split("T")[0], "Start date must be today or later")
      .required("Start date is required"),
    exDate: Yup.date()
      .min(Yup.ref("startDate"), "Expiration date must be after the start date")
      .required("Expiration date is required"),
  });

  const handleAddVoucher = async () => {
    const formData = {
      voucherValue,
      quantity,
      startDate,
      exDate,
    };

    try {
      await voucherSchema.validate(formData, { abortEarly: false });


      if (!token) {
        toast.error("No access token found. Please log in again.");
        return;
      }

      const response = await axios.post(
        `${MainAPI}/VoucherOfShop`,
        {
          voucherValue: Number(voucherValue),
          voucherQuantity: Number(quantity),
          startDate: startDate,
          endDate: exDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchData();
      setShowAdd(false);
      setExDate("");
      setVoucherValue("");
      setQuantity("");
      setStartDate("");
      toast.success("Voucher added successfully");

    } catch (error) {
      if (error.name === "ValidationError") {
        error.inner.forEach((err) => {
          toast.error(err.message);
        });
      } else {
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
    }
  };

  const handleEditVoucher = async (voucherId) => {
    navigate(`/edit-voucher/${voucherId}`);
  };

  const handleDeleteVoucher = async (voucherId) => {

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

  const sortVouchers = (vouchers, sortType) => {
    switch (sortType) {
      case "voucherValue":
        return [...vouchers].sort((a, b) => b.voucherValue - a.voucherValue);
      case "startDate":
        return [...vouchers].sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      case "newest":
        return [...vouchers].sort((a, b) => b.voucherId - a.voucherId);
      default:
        return vouchers;
    }
  };

  const sortedVouchers = sortVouchers(vouchers, sortType);

  const totalPages = Math.ceil(sortedVouchers.length / pageSize);

  const currentVouchers = sortedVouchers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <ToastContainer autoClose={2000} />
      <div className="manage-voucher-container">
        <div className="content">
          <h1>Voucher Management</h1>
          <div className="voucher-management">
            <div className="create-voucher-btn">
              <button className="btn add-btn" onClick={() => setShowAdd(true)}>
                Create Voucher
              </button>
            </div>

            <div className="sort-options">
              <label>Sort by: </label>
              <select onChange={(e) => setSortType(e.target.value)} value={sortType}>
                <option value="newest">Newest</option>
                <option value="voucherValue">Voucher Value</option>
                <option value="startDate">Start Date</option>
              </select>
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
                      <td>{voucher.voucherValue}%</td>
                      <td>{voucher.voucherQuantity}</td>
                      <td>{voucher.startDate}</td>
                      <td>{voucher.endDate}</td>
                      <td>
                        <button className="action-btn" onClick={() => handleEditVoucher(voucher.voucherId)}>
                          <MdModeEdit color="green" />
                        </button>
                        <button className="action-btn" onClick={() => handleDeleteVoucher(voucher.voucherId)}>
                          <DeleteIcon color="red" />
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
