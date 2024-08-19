import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { MainAPI } from "../../API";
import { formatVND, formattedDate } from "../../../utils/Format";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import "./PurchaseHistory.scss";

export default function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      try {
        let url = `${MainAPI}/Order/get-by-customerId?customerId=${customerId}`;
        if (filterStatus !== "") {
          url += `&status=${filterStatus}`;
        }

        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(response.data);

        let filteredOrders = response.data;

        if (dateFilter) {
          const formattedDate = dateFilter.toLocaleDateString('en-CA');
          filteredOrders = filteredOrders.filter((order) => {
            const orderDate = new Date(order.orderDate).toLocaleDateString('en-CA');
            return orderDate === formattedDate;
          });
        }

        setOrders(filteredOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order data:", error);
        toast.error("Failed to fetch orders. Please try again.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [filterStatus, dateFilter]);

  const handleOrderClick = (orderId) => {
    navigate(`/order-detail/${orderId}`);
  };

  const columns = [
    {
      name: "Order ID",
      selector: (row) => row.orderId,
      sortable: true,
    },
    {
      name: "Order Date",
      selector: (row) => formattedDate(new Date(row.orderDate)),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => (
        <div>
          <span
            className={`status-indicator ${getOrderStatusText(row.status)
              .toLowerCase()
              .replace(" ", "-")}`}
          />
          {getOrderStatusText(row.status)}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Total Price",
      selector: (row) => formatVND(row.totalPrice),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <button
          className="btn btn-success"
          onClick={() => handleOrderClick(row.orderId)}
        >
          Xem chi tiết
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "120px" }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="purchase-history-wrapper">
      <HeaderPage />
      <div className="container mt-5">
        <h2 className="text-center mt-5 mb-4">Lịch sử mua hàng</h2>
        <div className="d-flex justify-content-between mb-4">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">Tất cả</option>
            <option value="0">Đang chờ</option>
            <option value="1">Đã thanh toán</option>
            <option value="2">Đã hủy</option>
            <option value="3">Đang vận chuyển</option>
            <option value="4">Giao hàng thành công</option>
            <option value="5">Hoàn tiền</option>
          </select>
          <input
            type="date"
            className="form-control"
            value={dateFilter ? dateFilter.toISOString().substring(0, 10) : ""}
            onChange={(e) => setDateFilter(e.target.value ? new Date(e.target.value) : null)}
          />
        </div>
        <DataTable
          columns={columns}
          data={orders}
          pagination
          highlightOnHover
          responsive
        />
      </div>
      <FooterPage />
    </div>
  );
}

const getOrderStatusText = (status) => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Paid";
    case 2:
      return "Cancelled";
    case 3:
      return "Shipped";
    case 4:
      return "Delivered";
    case 5:
      return "Refunded";
    default:
      return "Unknown";
  }
};
