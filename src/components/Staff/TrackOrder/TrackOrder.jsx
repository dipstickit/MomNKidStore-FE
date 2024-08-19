import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { MainAPI } from "../../API";
import { convertSQLDate, formatVND } from "../../../utils/Format";
import "./TrackOrder.scss";

export default function TrackOrder() {
  const [trackOrderList, setTrackOrderList] = useState([]);
  const [customerNames, setCustomerNames] = useState({});
  const [voucherValues, setVoucherValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState(null);
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

  const fetchVoucherValue = (voucherId) => {
    return fetch(`${MainAPI}/VoucherOfShop/${voucherId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch voucher data for ID ${voucherId}`);
        return res.json();
      })
      .then((data) => data.voucherValue)
      .catch((error) => {
        console.error("Error fetching voucher data:", error);
        return "Unknown Voucher";
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
        const voucherValuesMap = {};

        for (let id of customerIds) {
          customerNamesMap[id] = await fetchCustomerName(id);
        }

        // Fetch voucher values
        const voucherIds = [...new Set(data.map((order) => order.voucherId).filter(Boolean))];
        for (let id of voucherIds) {
          voucherValuesMap[id] = await fetchVoucherValue(id);
        }

        setCustomerNames(customerNamesMap);
        setVoucherValues(voucherValuesMap);
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

  const getStatusClass = (status) => {
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
        <div className={`status ${getStatusClass(row.status).toLowerCase().replace(/\s+/g, '-')}`}>
          <span className="status-dot"></span>
          <span className="status-text">{getStatusClass(row.status).replace(/-/g, ' ')}</span>
        </div>
      )
    },
    { name: "Total Price", selector: (row) => formatVND(row.totalPrice), sortable: true },
    {
      name: "Voucher Value",
      selector: (row) => row.voucherId ? `${voucherValues[row.voucherId]}%` : "N/A",
      sortable: true
    },
    { name: "Exchanged Points", selector: (row) => row.exchangedPoint },
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
          <h1>Track Orders</h1>
          <div className="filters">
            <div className="form-group">
              <label>Status Filter</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="0">Pending</option>
                <option value="1">Completed</option>
                <option value="2">Canceled</option>
                <option value="3">Delivered</option>
                <option value="4">Delivering</option>
                <option value="5">Refund</option>
                <option value="10">Pre-order</option>
                <option value="11">Pre-order Completed</option>
                <option value="12">Pre-order Canceled</option>
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
