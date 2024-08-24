import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Voucher.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Switch from "react-switch";
import { MainAPI } from "../../API";
import { MdModeEdit } from "react-icons/md";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const pageSize = 10;
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("accessToken"));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    if (!token) {
      console.error("No access token found.");
      return;
    }

    try {
      const response = await axios.get(`${MainAPI}/VoucherOfShop/staff`, {
        headers: {
          "x-access-token": token,
          "Authorization": `Bearer ${token}`,
        },
      });

      setVouchers(response.data);
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

      await axios.post(
        `${MainAPI}/VoucherOfShop`,
        {
          voucherValue: Number(voucherValue),
          voucherQuantity: Number(quantity),
          startDate,
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
      resetForm();
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

  const handleSwitchStatus = async (voucherId, currentStatus) => {
    if (!token) {
      toast.error("No access token found. Please log in again.");
      return;
    }

    try {
      await axios.put(
        `${MainAPI}/VoucherOfShop`,
        null,
        {
          params: {
            voucherId,
            status: !currentStatus,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Voucher status updated successfully");
      fetchData();
    } catch (error) {
      console.error("Error switching voucher status:", error);
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
    let sortedVouchers = [...vouchers];
    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      sortedVouchers = sortedVouchers.filter((voucher) => voucher.status === isActive);
    }
    switch (sortType) {
      case "voucherValue":
        return sortedVouchers.sort((a, b) => b.voucherValue - a.voucherValue);
      case "startDate":
        return sortedVouchers.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      case "newest":
        return sortedVouchers.sort((a, b) => b.voucherId - a.voucherId);
      default:
        return sortedVouchers;
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

  const resetForm = () => {
    setExDate("");
    setVoucherValue("");
    setQuantity("");
    setStartDate("");
    setShowAdd(false);
  };

  return (
    <>
      <div className="manage-voucher-container">
        <div className="content">
          <h1>Voucher Management</h1>
          <div className="voucher-management">
            <div className="create-voucher-btn">
              <button className="btn add-btn" onClick={() => setShowAdd(true)}>
                Create Voucher
              </button>
            </div>

            <div className="filter-options">
              <label>Status: </label>
              <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
                        <Switch
                          checked={voucher.status}
                          onChange={() => handleSwitchStatus(voucher.voucherId, voucher.status)}
                          onColor="#86d3ff"
                          onHandleColor="#2693e6"
                          handleDiameter={30}
                          uncheckedIcon={false}
                          checkedIcon={false}
                          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                          height={20}
                          width={48}
                          className="react-switch"
                          id={`switch-${voucher.voucherId}`}
                        />
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
