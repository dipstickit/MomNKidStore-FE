import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import "./CustomerProfile.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainAPI } from "../../API";
import defaultAvatar from "../../../../public/assest/images/avatar/default-avatar.png"; 
import HeaderPage from "../../../utils/Header/Header"; 
import FooterPage from "../../../utils/Footer/FooterPage"; 

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedCustomer, setUpdatedCustomer] = useState({});

  const fetchCustomer = async (customerId, token) => {
    try {
      const response = await axios.get(`${MainAPI}/Customer/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch customer data. Please try again.");
      setLoading(false);
      return null;
    }
  };

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

        const customerData = await fetchCustomer(customerId, token);
        if (customerData) {
          setCustomer(customerData);
          setUpdatedCustomer(customerData);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error decoding token or fetching customer:", error);
        toast.error("An error occurred. Please try again.");
        setLoading(false);
      }
    };

    loadCustomerProfile();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setUpdatedCustomer(customer);
  };

  const handleSaveClick = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    try {
      await axios.put(`${MainAPI}/Customer/${customer.customerId}`, updatedCustomer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCustomer(updatedCustomer);
      setIsEditing(false);
      toast.success("Customer profile updated successfully!");
    } catch (error) {
      console.error("Failed to update customer profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const handleChange = (e) => {
    setUpdatedCustomer({
      ...updatedCustomer,
      [e.target.name]: e.target.value,
    });
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
      <HeaderPage /> {/* Add the HeaderPage component */}
      <div className="container profile-container">
        <ToastContainer autoClose={2000} />
        <h2>Thông tin cá nhân</h2>
        <div className="profile-card">
          <div className="avatar-container">
            <img src={defaultAvatar} alt="Customer Avatar" className="avatar" />
          </div>
          <div className="profile-details">
            {isEditing ? (
              <div className="edit-form">
                <input
                  type="text"
                  name="userName"
                  value={updatedCustomer.userName}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="phone"
                  value={updatedCustomer.phone}
                  onChange={handleChange}
                />
                <input
                  type="text"
                  name="address"
                  value={updatedCustomer.address}
                  onChange={handleChange}
                />
                <input
                  type="date"
                  name="dob"
                  value={updatedCustomer.dob}
                  onChange={handleChange}
                />
                <div>
                  <button className="save" onClick={handleSaveClick}>
                    Save
                  </button>
                  <button className="cancel" onClick={handleCancelClick}>
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>Username:</strong> {customer.userName}</p>
                <p><strong>Phone:</strong> {customer.phone}</p>
                <p><strong>Address:</strong> {customer.address}</p>
                <p><strong>Date of Birth:</strong> {customer.dob}</p>
                <p><strong>Points:</strong> {customer.point}</p>
                <button className="edit" onClick={handleEditClick}>
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <FooterPage /> {/* Add the FooterPage component */}
    </div>
  );
}
