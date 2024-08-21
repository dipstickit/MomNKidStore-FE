import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../../API";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreateReport.scss";

export default function CreateReport() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [reportTitle, setReportTitle] = useState("");
  const [reportContent, setReportContent] = useState("");
  const [reportImage, setReportImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      const response = await axios.post(
        `${MainAPI}/Report/CreateReport`,
        {
          orderId: Number(orderId),
          customerId: Number(customerId),
          reportTitle: reportTitle,
          reportContent: reportContent,
          reportImage: reportImage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(response); // Log the entire response

      // Adjust the condition based on the actual response structure
      if (response.status === 200 && response.data) {
        toast.success("Report created successfully.");
      } else {
        toast.error("Failed to create report.");
      }
    } catch (error) {
      console.error("Error creating report:", error);
      toast.error("Error creating report.");
    }
  };

  return (
    <div className="create-report-wrapper">
      <HeaderPage />
      <div className="container create-report-container">
        <h1>Báo cáo sản phẩm cho mã đơn hàng: {orderId}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tiêu đề báo cáo:</label>
            <input
              type="text"
              className="form-control"
              value={reportTitle}
              onChange={(e) => setReportTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Nội dung báo cáo:</label>
            <textarea
              className="form-control"
              value={reportContent}
              onChange={(e) => setReportContent(e.target.value)}
              rows="5"
              required
            />
          </div>
          <div className="form-group">
            <label>URL ảnh</label>
            <input
              type="text"
              className="form-control"
              value={reportImage}
              onChange={(e) => setReportImage(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary mt-3">
            Xác nhận
          </button>
        </form>
      </div>
      <FooterPage />
      <ToastContainer />
    </div>
  );
}
