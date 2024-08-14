import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import "./PurchaseHistory.scss";
import { jwtDecode } from "jwt-decode";
import { MainAPI } from "../../API";
import { formatVND, formattedDate } from "../../../utils/Format";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import HeaderPage from "../../../utils/Header/Header"; // Import HeaderPage
import FooterPage from "../../../utils/Footer/FooterPage"; // Import FooterPage

export default function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null); // null means no filter
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    const fetchOrders = async () => {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      try {
        let url = `${MainAPI}/Order/get-by-customerId?customerId=${customerId}`;
        if (filterStatus !== null) {
          url += `&status=${filterStatus}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order data:", error);
        toast.error("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filterStatus]); // Re-fetch orders whenever filterStatus changes

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleOrderClick = (orderId) => {
    navigate(`/order-detail/${orderId}`); // Navigate to the OrderDetail page
  };

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "120px" }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="purchase-history-wrapper">
      <HeaderPage /> {/* Add the HeaderPage */}
      <div className="container">
        <h2>Lịch sử mua hàng</h2>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          <button onClick={() => handleFilterChange(null)}>Tất cả</button>
          <button onClick={() => handleFilterChange(0)}>Đang chờ</button>
          <button onClick={() => handleFilterChange(1)}>Đã thanh toán</button>
          <button onClick={() => handleFilterChange(2)}>Đã hủy</button>
          <button onClick={() => handleFilterChange(3)}>Đang vận chuyển</button>
          <button onClick={() => handleFilterChange(4)}>Giao hàng thành công</button>
          <button onClick={() => handleFilterChange(5)}>Hoàn tiền</button>
        </div>

        <div className="order-list">
          {orders.map((order) => (
            <div
              key={order.orderId}
              className="order-card"
              onClick={() => handleOrderClick(order.orderId)} // Handle order click
              style={{ cursor: "pointer" }} // Make it clear that this is clickable
            >
              <p>Mã đơn hàng: {order.orderId}</p>
              <p>Ngày: {formattedDate(new Date(order.orderDate))}</p>
              <p>Tổng tiền: {formatVND(order.totalPrice)}</p>
              <p>Trạng thái: {getOrderStatusText(order.status)}</p>
            </div>
          ))}
        </div>
      </div>
      <FooterPage /> {/* Add the FooterPage */}
    </div>
  );
}

// Helper function to get the status text
const getOrderStatusText = (status) => {
  switch (status) {
    case 0:
      return "Đang chờ";
    case 1:
      return "Đã thanh toán";
    case 2:
      return "Đã hủy";
    case 3:
      return "Đang vận chuyển";
    case 4:
      return "Giao hàng thành công";
    case 5:
      return "Hoàn tiền";
    default:
      return "Unknown";
  }
};
