import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner, Dropdown } from "react-bootstrap";
import axios from "axios";
import { MainAPI } from "../API";
import { convertSQLDate, formatVND } from "../../utils/Format";
import "./ManageOrder.scss";

export default function ManageOrder() {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const token = JSON.parse(localStorage.getItem("accessToken"));

  const fetchData = () => {
    axios.get(`${MainAPI}/Order`, {
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
        <Dropdown>
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

  return (
    <div className="manageOrder-container">
      {loading ? (
        <div className="spinner-track">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="content">
          <h1>Manage Orders</h1>
          <DataTable
            columns={columns}
            data={orderList.slice(
              (currentPage - 1) * ordersPerPage,
              currentPage * ordersPerPage
            )}
            pagination
            paginationServer
            paginationTotalRows={orderList.length}
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
