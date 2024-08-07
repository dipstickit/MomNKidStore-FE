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

  const handleAddVoucher = async () => {
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

      console.log("Add Voucher Response:", response.data);

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
    console.log("Update voucher with ID:", voucherId);
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

  return (
    <>
      <ToastContainer />
      <div className="create-voucher-btn">
        <button
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
        >
          Create Voucher
        </button>
      </div>
      <div className="voucher">
        {showAdd && (
          <div className="add-voucher" style={{ marginLeft: "10px", textAlign: 'left' }}>
            <div className="add-voucher-detail">
              <h4 style={{ marginLeft: '10px' }}>Create Voucher</h4>
              <label className="code-dis">Voucher Value:</label>
              <input
                type="number"
                value={voucherValue}
                onChange={(event) => setVoucherValue(event.target.value)}
              />
              &nbsp;&nbsp;&nbsp;
              <label>Start Date:</label>
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
              &nbsp;&nbsp;&nbsp;
              <label>Expiration Date:</label>
              <input
                type="date"
                value={exDate}
                onChange={(event) => setExDate(event.target.value)}
              />
              &nbsp;&nbsp;&nbsp;
              <label>Quantity:</label>
              <input
                type="number"
                value={quantity}
                onChange={(event) => setQuantity(event.target.value)}
              />
              &nbsp;&nbsp;&nbsp;
              <button className="add-cancel" onClick={handleAddVoucher}>
                Create
              </button>
              <button className="add-cancel" onClick={() => setShowAdd(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="voucher-th">
          <table className="table-voucher-th">
            <thead>
              <tr>
                <th>Voucher ID</th>
                <th>Voucher Value</th>
                <th>Voucher Quantity</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
          </table>
        </div>

        <div className="voucher-tb">
          <table className="table-voucher-tb">
            <tbody>
              {vouchers.length > 0 ? (
                vouchers.map((voucher) => (
                  <tr key={voucher.voucherId}>
                    <td>{voucher.voucherId}</td>
                    <td>{voucher.voucherValue}</td>
                    <td>{voucher.voucherQuantity}</td>
                    <td>{voucher.startDate}</td>
                    <td>{voucher.endDate}</td>
                    <td>
                      <button onClick={() => handleEditVoucher(voucher.voucherId)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteVoucher(voucher.voucherId)}>
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
      </div>
    </>
  );
}
