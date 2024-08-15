import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MainAPI } from "../../API";
import { convertSQLDate, formatVND } from "../../../utils/Format";
import "./ConfirmOrder.scss";

export default function TrackOrder() {
  const [trackOrderList, setTrackOrderList] = useState([]);
  const [customerNames, setCustomerNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const token = JSON.parse(localStorage.getItem("accessToken"));
  const navigate = useNavigate();

  const fetchCustomerName = (customerId) => {
    return fetch(`${MainAPI}/Customer/${customerId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch customer data for ID ${customerId}`);
        return res.json();
      })
      .then((data) => data.userName)
      .catch((error) => {
        console.error("Error fetching customer data:", error);
        return "Unknown Customer";
      });
  };

  const fetchData = () => {
    fetch(`${MainAPI}/Order`, {
      method: "GET",
      headers: {
        "x-access-token": token,
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data get order");
        return res.json();
      })
      .then(async (data) => {
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

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Completed";
      case 2:
        return "Canceled";
      case 3:
        return "Delivered";
      case 4:
        return "Delivering";
      case 5:
        return "Refund";
      case 10:
        return "Pre-order";
      case 11:
        return "Pre-order Completed";
      case 12:
        return "Pre-order Canceled";
      default:
        return "Unknown";
    }
  };

  const columns = [
    { name: "Order ID", selector: (row) => row.orderId, sortable: true },
    { name: "Order Date", selector: (row) => convertSQLDate(row.orderDate), sortable: true },
    { name: "Customer Name", selector: (row) => customerNames[row.customerId] || "Loading..." },
    {
      name: "Status", selector: (row) => row.status, sortable: true, cell: (row) => (
        <div className={getStatusText(row.status)}>
          <span className="status-dot"></span>
          {getStatusText(row.status)}
        </div>
      )
    },
    { name: "Total Price", selector: (row) => formatVND(row.totalPrice), sortable: true },
  ];


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowClicked = (row) => {
    navigate(`/staff/track_orders/detail/${row.orderId}`);
  };

  return (
    <div className="trackOrder-container">
      {loading ? (
        <div className="spinner-track">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="content">
          <h1>Confirm Orders</h1>
          <DataTable
            columns={columns}
            data={trackOrderList.slice(
              (currentPage - 1) * ordersPerPage,
              currentPage * ordersPerPage
            )}
            pagination
            paginationServer
            paginationTotalRows={trackOrderList.length}
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
