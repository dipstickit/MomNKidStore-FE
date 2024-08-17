import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import "./CustomerProfile.scss";
import { toast } from "react-toastify";
import { MainAPI } from "../../API";
import defaultAvatar from "../../../../public/assest/images/avatar/default-avatar.png";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import { useNavigate } from "react-router-dom";
import { formattedDate } from "../../../utils/Format";
// Import React Icons
import { FaHistory, FaEdit, FaFileAlt } from 'react-icons/fa';  // Import icon mới

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomerProfile = async () => {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      if (!token) {
        console.log("No token found");
        toast.error("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const customerId = decodedToken.customerId;

        const response = await axios.get(`${MainAPI}/Customer/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCustomer(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        toast.error("Failed to fetch customer data. Please try again.");
        setLoading(false);
      }
    };

    loadCustomerProfile();
  }, []);

  const handleEditClick = () => {
    navigate('/update-info'); // Navigate to the update info page
  };

  const handleViewHistory = () => {
    navigate('/purchase-history'); // Navigate to the purchase history page
  };

  const handleViewReports = () => {
    navigate('/product-reports'); // Navigate to the product reports page
  };

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "120px" }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!customer) {
    return <div>No customer data found</div>;
  }

  return (
    <div className="profile-page-wrapper">
      <HeaderPage />
      <div className="container profile-container">
        <div className="avatar-container">
          <img src={defaultAvatar} alt="Customer Avatar" className="avatar" />
        </div>
        <div className="profile-details">
          <h2>{customer.userName}</h2>
          <p>Thông tin liên lạc: {customer.phone}</p>
          <p>Địa chỉ thường trú: {customer.address}</p>
          <p>Ngày tháng năm sinh: {formattedDate(new Date(customer.dob))}</p>
          <p>Điểm tích lũy: {customer.point}</p>
        </div>
        <div className="menu-list">
          <div className="menu-item" onClick={handleViewHistory}>
            <FaHistory style={{ marginRight: '10px' }} />
            Lịch sử mua hàng
          </div>
          <div className="menu-item" onClick={handleEditClick}>
            <FaEdit style={{ marginRight: '10px' }} />
            Cập nhật thông tin
          </div>
          <div className="menu-item" onClick={handleViewReports}>  {/* Mục mới cho báo cáo sản phẩm */}
            <FaFileAlt style={{ marginRight: '10px' }} />
            Báo cáo sản phẩm
          </div>
        </div>
      </div>
      <FooterPage />
    </div>
  );
}
