import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../API";
import { convertSQLDate, formatVND } from "../../../utils/Format";
import "./ConfirmOrder.scss";

export default function TrackOrder() {
  const [trackOrderList, setTrackOrderList] = useState([]);
  const [customerNames, setCustomerNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState(""); // Filter by status
  const [dateFilter, setDateFilter] = useState(null); // Filter by date
  const token = JSON.parse(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  const fetchCustomerName = (customerId) => {
    return axios.get(`${MainAPI}/Customer/${customerId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.data.userName)
      .catch((error) => {
        console.error("Error fetching customer data:", error);
        return "Unknown Customer";
      });
  };

  const fetchData = () => {
    axios.get(`${MainAPI}/Order`, {
      headers: {
        "x-access-token": token,
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        const data = response.data;
        setTrackOrderList(data);

        const customerIds = [...new Set(data.map((order) => order.customerId))];
        const customerNamesMap = {};

        for (let id of customerIds) {
          customerNamesMap[id] = await fetchCustomerName(id);
        }

        setCustomerNames(customerNamesMap);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data order:", error);
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
      case 0:
        return "Pending";
      case 1:
        return "Paid";
      case 2:
        return "Canceled";
      case 3:
        return "Delivered";
      case 4:
        return "Delivering";
      case 5:
        return "Refund";
      default:
        return "Unknown";
    }
  };

  const statusOptions = [
    { label: "Pending", value: 0 },
    { label: "Paid", value: 1 },
    { label: "Canceled", value: 2 },
    { label: "Delivered", value: 3 },
    { label: "Delivering", value: 4 },
    { label: "Refund", value: 5 },
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
    { name: "Customer Name", selector: (row) => customerNames[row.customerId] || "Loading..." },
    {
      name: "Status", selector: (row) => row.status, sortable: true, cell: (row) => (
        <div className={`status ${getStatusText(row.status).toLowerCase().replace(/\s+/g, '-')}`}>
          <span className="status-dot"></span>
          <span className="status-text">{getStatusText(row.status)}</span>
        </div>
      )
    },
    { name: "Total Price", selector: (row) => formatVND(row.totalPrice), sortable: true },
    {
      name: "Action", cell: (row) => (
        <Dropdown>
          <Dropdown.Toggle className="btn-status" id={`dropdown-basic-${row.orderId}`}>
            Change Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {statusOptions.map(option => (
              <Dropdown.Item
                key={option.value}
                onClick={() => updateOrderStatus(row.orderId, option.value)}
              >
                {option.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      )
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClicked = (row) => {
    navigate(`/staff/track_orders/detail/${row.orderId}`);
  };

  const filteredData = filterOrders(trackOrderList);

  return (
    <div className="trackOrder-container">
      {loading ? (
        <div className="spinner-track">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="content">
          <h1>Confirm Orders</h1>
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
            onRowClicked={handleRowClicked}
          />
        </div>
      )}
    </div>
  );
}
