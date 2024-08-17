import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../API";
import { formattedDate } from "../../../utils/Format";
import { Spinner } from "react-bootstrap";
import HeaderPage from "../../../utils/Header/Header";  // Import HeaderPage
import FooterPage from "../../../utils/Footer/FooterPage";  // Import FooterPage
import "./ViewReportDetail.scss";

export default function ViewReportDetail() {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReportDetail = async () => {
            try {
                const token = JSON.parse(localStorage.getItem("accessToken"));
                const response = await axios.get(`${MainAPI}/Report/GetSingleReport?reportId=${reportId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });
                setReport(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching report detail:", error);
                setLoading(false);
            }
        };

        fetchReportDetail();
    }, [reportId]);

    if (loading) {
        return (
            <div className="spinner-report">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    const placeholderImage = "https://via.placeholder.com/150"; // URL placeholder image

    return (
        <div>
            <HeaderPage /> {/* Gắn HeaderPage */}
            <div className="report-detail-container">
                {report ? (
                    <div className="report-detail">
                        <h1>Report ID: {report.reportId}</h1>
                        <p><strong>Order ID:</strong> {report.orderId}</p>
                        <p><strong>Customer Name:</strong> {report.customerName}</p>
                        <p><strong>Description:</strong> {report.reportContent || "No Description Provided"}</p>
                        <p><strong>Date Created:</strong> {formattedDate(new Date(report.createAt))}</p>
                        <p><strong>Last Updated:</strong> {report.updateAt ? formattedDate(new Date(report.updateAt)) : "Not Updated"}</p>
                        <p><strong>Status:</strong> {report.status ? "Active" : "Inactive"}</p>
                        <div className="report-image-container">
                            <img src={report.reportImage || placeholderImage} alt="Report" />
                        </div>
                    </div>
                ) : (
                    <p>Report not found</p>
                )}
            </div>
            <FooterPage /> {/* Gắn FooterPage */}
        </div>
    );
}
