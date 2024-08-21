import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { MainAPI } from "../../API";
import { formattedDate } from "../../../utils/Format";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import { MdDelete } from "react-icons/md"; // Importing the delete icon
import "./ViewReport.scss";

export default function ViewReport() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      try {
        const url = `${MainAPI}/Report/GetCustomerReports?customerId=${customerId}`;
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReports(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching report data:", error);
        toast.error("Failed to fetch reports. Please try again.");
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleReportClick = (reportId) => {
    navigate(`/customer/report-detail/${reportId}`);
  };

  const handleDeleteReport = async (reportId) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const decodedToken = jwtDecode(token);
    const customerId = decodedToken.customerId;  // Lấy customerId từ token

    try {
        const url = `${MainAPI}/Report/DeleteReport?reportId=${reportId}&customerId=${customerId}`;
        await axios.delete(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        toast.success("Report deleted successfully.");
        // Update the report list after deletion
        setReports(reports.filter((report) => report.reportId !== reportId));
    } catch (error) {
        console.error("Error deleting report:", error);
        toast.error("Failed to delete the report.");
    }
};


  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Processing";
      case 2:
        return "Canceled";
      case 3:
        return "Exchanged";
      default:
        return "Unknown";
    }
  };

  const columns = [
    {
      name: "Report ID",
      selector: (row) => row.reportId,
      sortable: true,
    },
    {
      name: "Order ID",
      selector: (row) => row.orderId,
      sortable: true,
    },
    {
      name: "Report Date",
      selector: (row) => formattedDate(new Date(row.createAt)),
      sortable: true,
    },
    {
      name: "Customer Name",
      selector: (row) => row.customerName,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => getStatusText(row.status),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => handleReportClick(row.reportId)}
          >
            Xem chi tiết
          </button>
          {row.status === 0 && ( // Only show delete button if status is "Pending"
            <button
              className="btn btn-danger"
              onClick={() => handleDeleteReport(row.reportId)}
            >
              <MdDelete size={18} /> {/* Icon Delete */}
            </button>
          )}
        </div>
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
    <div className="view-report-wrapper">
      <HeaderPage />
      <div className="container mt-5">
        <h2 className="text-center mt-5 mb-4">Báo cáo sản phẩm</h2>
        <DataTable
          columns={columns}
          data={reports}
          pagination
          highlightOnHover
          responsive
        />
      </div>
      <FooterPage />
    </div>
  );
}
