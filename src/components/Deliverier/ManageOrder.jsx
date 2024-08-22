import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { MainAPI } from "../API";
import { convertSQLDate, formatVND } from "../../utils/Format";
import "./ManageOrder.scss";

export default function ManageOrder() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [dateFilter, setDateFilter] = useState(null); // Filter by date
  const token = JSON.parse(localStorage.getItem("accessToken"));

  const fetchData = () => {
    let url = `${MainAPI}/Order/OrdersForShipper`;

    axios.get(url, {
      headers: {
        "x-access-token": token,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const data = response.data;
        data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrderList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching order data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const updateOrderStatus = (orderId, newStatus) => {
    axios.put(`${MainAPI}/Order`, null, {
      params: {
        orderId: orderId,
        status: newStatus
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Order status updated successfully:", response.data);
        fetchData(); // Refresh the data after update
      })
      .catch((error) => {
        console.error("Error updating order status:", error);
      });
  };

  const getStatusText = (status) => {
    switch (status) {
      case 2:
        return "Canceled";
      case 3:
        return "Delivered";
      case 4:
        return "Delivering";
      default:
        return "Unknown";
    }
  };

  const statusOptions = [
    { label: "Canceled", value: 2 },
    { label: "Delivered", value: 3 },
    { label: "Delivering", value: 4 },
  ];

  const filterOrders = (orders) => {
    let filteredOrders = orders;

    if (statusFilter) {
      filteredOrders = filteredOrders.filter((order) => order.status === parseInt(statusFilter));
    }

    if (dateFilter) {
      const formattedDate = dateFilter.toLocaleDateString('en-CA');
      filteredOrders = filteredOrders.filter((order) => {
        const orderDate = new Date(order.orderDate).toLocaleDateString('en-CA');
        return orderDate === formattedDate;
      });
    }
    return filteredOrders;
  };

  const columns = [
    { name: "Order ID", selector: (row) => row.orderId, sortable: true },
    { name: "Order Date", selector: (row) => convertSQLDate(row.orderDate), sortable: true },
    { name: "Total Price", selector: (row) => formatVND(row.totalPrice), sortable: true },
    {
      name: "Status", selector: (row) => row.status, sortable: true, cell: (row) => (
        <div className={`status ${getStatusText(row.status).toLowerCase().replace(/\s+/g, '-')}`}>
          <span className="status-dot"></span>
          <span className="status-text">{getStatusText(row.status)}</span>
        </div>
      )
    },
    {
      name: "Action", cell: (row) => (
        <Dropdown drop="up">
        <Dropdown.Toggle className="btn-status" id={`dropdown-basic-${row.orderId}`}>
          Change Status
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => updateOrderStatus(row.orderId, 2)}>
            Canceled
          </Dropdown.Item>
          <Dropdown.Item onClick={() => updateOrderStatus(row.orderId, 3)}>
            Delivered
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      
      )
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const filteredData = filterOrders(orderList);

  return (
    <div className="manageOrder-container">
      {loading ? (
        <div className="spinner-track">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="content">
          <h1>Manage Orders</h1>
          <div className="filters">
            <div className="form-group">
              <label>Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date Filter (YYYY-MM-DD)</label>
              <DatePicker
                selected={dateFilter}
                onChange={(date) => setDateFilter(date)}
                dateFormat="yyyy-MM-dd"
                placeholderText="Order date"
              />
            </div>
          </div>

          <DataTable
            columns={columns}
            data={filteredData.slice(
              (currentPage - 1) * ordersPerPage,
              currentPage * ordersPerPage
            )}
            pagination
            paginationServer
            paginationTotalRows={filteredData.length}
            paginationPerPage={ordersPerPage}
            onChangePage={handlePageChange}
            highlightOnHover
            pointerOnHover
          />
        </div>
      )}
    </div>
  );
}
