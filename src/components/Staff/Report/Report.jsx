import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { MdModeEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";
import { formattedDate } from '../../../utils/Format';
import { Spinner } from "react-bootstrap";
import "./Report.scss";
export default function Report() {
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

    useEffect(() => {
        fetchReports();
    }, []);

    const columns = [
        { name: "ID", selector: (row) => row.reportId, sortable: true },
        { name: "Image", cell: (row) => (row.reportImage ? <img src={row.reportImage} alt="Report" className="report-image" /> : 'No Image') },
        { name: "Date", selector: (row) => formattedDate(new Date(row.createAt)), sortable: true },
        { name: "Description", selector: (row) => row.reportContent },
        { name: "User Name", selector: (row) => row.customerName },
        { name: "Update At", selector: (row) => formattedDate(new Date(row.updateAt)), sortable: true },
        { name: "Status", selector: (row) => (row.status ? "Active" : "Inactive") },
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
        <div className="reportManagement-container">

            <div className="content">
                <h1>Report Management</h1>
                <div className="report-management">
                    {loading ? (
                        <div className="spinner-report">
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
