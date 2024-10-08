import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../API";
import { formattedDate } from "../../../utils/Format";
import { Spinner, Button } from "react-bootstrap";
import { MdEdit } from "react-icons/md"; // Import Edit icon
import HeaderPage from "../../../utils/Header/Header";  // Import HeaderPage
import FooterPage from "../../../utils/Footer/FooterPage";  // Import FooterPage
import { toast } from "react-toastify"; // Import toast for notifications
import "./ViewReportDetail.scss";

export default function ViewReportDetail() {
    const { reportId } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false); // State to control edit mode
    const [editData, setEditData] = useState({
        reportTitle: '',
        reportContent: '',
        reportImage: ''
    }); // State to store data during editing

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
                setEditData({
                    reportTitle: response.data.reportTitle,
                    reportContent: response.data.reportContent,
                    reportImage: response.data.reportImage
                });
                setLoading(false);
            } catch (error) {
                console.error("Error fetching report detail:", error);
                toast.error("Failed to load report details. Please try again.");
                setLoading(false);
            }
        };

        fetchReportDetail();
    }, [reportId]);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value
        });
    };

    const handleSaveChanges = async () => {
        if (!editData.reportTitle || !editData.reportContent) {
            toast.error("Title and content cannot be empty.");
            return;
        }

        try {
            const token = JSON.parse(localStorage.getItem("accessToken"));
            await axios.put(`${MainAPI}/Report/UpdateReport?reportId=${reportId}`, 
            {
                
                orderId: report.orderId,
                customerId: report.customerId,
                reportTitle: editData.reportTitle,
                reportContent: editData.reportContent,
                reportImage: editData.reportImage
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            setReport({
                ...report,
                reportTitle: editData.reportTitle,
                reportContent: editData.reportContent,
                reportImage: editData.reportImage
            });
            setIsEditing(false);
            toast.success("Report updated successfully.");
        } catch (error) {
            console.error("Error updating report:", error);
            toast.error("Failed to update the report. Please try again.");
        }
    };

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
            <HeaderPage /> {/* Attach HeaderPage */}
            <div className="report-detail-container">
                {report ? (
                    <div className="report-detail">
                        <h1>Report Code: {report.reportId}</h1>
                        <p><strong>Order Code:</strong> {report.orderId}</p>
                        <p><strong>Customer Name:</strong> {report.customerName}</p>
                        {isEditing ? (
                            <div>
                                <label><strong>Report Title:</strong></label>
                                <input
                                    type="text"
                                    name="reportTitle"
                                    value={editData.reportTitle}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                                <label><strong>Content Sent:</strong></label>
                                <textarea
                                    name="reportContent"
                                    value={editData.reportContent}
                                    onChange={handleInputChange}
                                    className="form-control"
                                    rows="4"
                                />
                                <label><strong>URL Image:</strong></label>
                                <input
                                    type="text"
                                    name="reportImage"
                                    value={editData.reportImage}
                                    onChange={handleInputChange}
                                    className="form-control"
                                />
                                <div className="report-image-container">
                                    <img src={editData.reportImage || placeholderImage} alt="Report" />
                                </div>
                                <Button variant="success" onClick={handleSaveChanges}>Save change</Button>
                                <Button variant="secondary" onClick={handleEditToggle} className="ms-2">Hủy bỏ</Button>
                            </div>
                        ) : (
                            <>
                                <p><strong>Report Title:</strong> {report.reportTitle}</p>
                                <p><strong>Content sent:</strong> {report.reportContent || "No content yet"}</p>
                                <p><strong>Response Content:</strong> {report.responseContent || "No response yet"}</p>
                                <p><strong>Date sent:</strong> {formattedDate(new Date(report.createAt))}</p>
                                <p><strong>Update date:</strong> {report.updateAt ? formattedDate(new Date(report.updateAt)) : "Not updated yet"}</p>
                                <p><strong>Status:</strong> {report.status === 0 ? "Pending" : report.status === 1 ? "Processing" : report.status === 2 ? "Canceled" : report.status === 3 ? "Exchanged" : "Unknown"}</p>
                                <div className="report-image-container">
                                    <img src={report.reportImage || placeholderImage} alt="Report" />
                                </div>
                                {report.status === 2 && (
                                    <Button variant="primary" onClick={handleEditToggle}>
                                        <MdEdit size={18} /> Edit
                                    </Button>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <p>There are no reports from you yet</p>
                )}
            </div>
            <FooterPage /> {/* Attach FooterPage */}
        </div>
    );
}
