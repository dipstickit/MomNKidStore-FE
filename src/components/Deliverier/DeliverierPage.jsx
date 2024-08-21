import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { MainAPI } from "../API";
import { formattedDate } from '../../utils/Format';
import { Spinner, Dropdown } from "react-bootstrap";
import { createPopper } from '@popperjs/core'; // Import Popper.js
import "./DeliverierPage.scss";

export default function DeliverierPage() {
    const nav = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReports = async () => {
        try {
            const token = JSON.parse(localStorage.getItem("accessToken"));
            const response = await axios.get(`${MainAPI}/Report/GetAllReports`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setReports(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching report data:", error);
            toast.error("Error fetching report data.");
            setLoading(false);
        }
    };

    const updateReportStatus = async (reportId, newStatus, orderId) => {
      try {
          const token = JSON.parse(localStorage.getItem("accessToken"));
          if (!token) {
              throw new Error("Token is missing in localStorage");
          }
  
          // Decode the token to get the payload
          const decodedToken = jwtDecode(token);
          const accountId = decodedToken.accountId;  // Ensure your token contains accountId in its payload
  
          console.log('Decoded Token:', decodedToken);
          console.log('Account ID:', accountId);
  
          if (!accountId) {
              throw new Error("accountId is missing in token payload");
          }
  
          const response = await axios.put(`${MainAPI}/Report/UpdateReportStatus`, 
          {
              accountId: accountId,
              reportId: reportId,
              orderId: orderId,
              status: newStatus,
              responseContent: "Cảm ơn báo cáo của bạn chúng tôi đang xử lý"
          },
          {
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`
              }
          });
  
          if (response.status === 200) {
              toast.success("Status updated successfully.");
              fetchReports(); // Fetch the reports again to refresh the status
          } else {
              toast.error("Failed to update status.");
          }
      } catch (error) {
          console.error("Error updating report status:", error);
          toast.error("Error updating report status.");
      }
  };
  
  

    useEffect(() => {
        fetchReports();
    }, []);

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

    const statusOptions = [
        { value: 2, label: "Canceled" },
        { value: 3, label: "Exchanged" }
    ];

    const columns = [
        { name: "ID", selector: (row) => row.reportId, sortable: true },
        { name: "Image", cell: (row) => (row.reportImage ? <img src={row.reportImage} alt="Report" className="report-image" /> : 'No Image') },
        { name: "Date", selector: (row) => formattedDate(new Date(row.createAt)), sortable: true },
        { name: "Description", selector: (row) => row.reportContent },
        { name: "User Name", selector: (row) => row.customerName },
        { name: "Update At", selector: (row) => formattedDate(new Date(row.updateAt)), sortable: true },
        { 
            name: "Status", 
            selector: (row) => row.status, 
            sortable: true, 
            cell: (row) => (
                <Dropdown>
                    <Dropdown.Toggle className="btn-status" id={`dropdown-button-${row.reportId}`} ref={(ref) => ref && createPopper(ref, document.querySelector(`#dropdown-menu-${row.reportId}`), {
                        placement: 'bottom-start',
                        modifiers: [
                            {
                                name: 'preventOverflow',
                                options: {
                                    boundary: 'viewport',
                                },
                            },
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 8],
                                },
                            },
                        ],
                    })}>
                        {getStatusText(row.status)}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                        id={`dropdown-menu-${row.reportId}`}
                        className="dropdown-menu-custom"
                    >
                        {statusOptions.map(option => (
                            <Dropdown.Item 
                                key={option.value} 
                                onClick={() => updateReportStatus(row.reportId, option.value, row.orderId)}>
                                {option.label}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            )
        },
        {
            name: "Actions",
            cell: (row) => (
                <div className="action">
                    <span className="action-btn" onClick={() => nav(`/detail-report/${row.reportId}`)}>
                        <MdModeEdit color="green" />
                    </span>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div className="deliverierManagement-container">
            <ToastContainer />
            <div className="content">
                <h1>Transport Report Management</h1>
                <div className="deliverier-management">
                    {loading ? (
                        <div className="spinner-deliverier">
                            <Spinner animation="border" role="status" />
                        </div>
                    ) : (
                        <div className="table">
                            <DataTable
                                columns={columns}
                                data={reports}
                                pagination
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 60, 70, 80]}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
