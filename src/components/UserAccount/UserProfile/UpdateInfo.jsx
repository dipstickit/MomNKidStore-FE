import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { MainAPI } from "../../API";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import "./UpdateInfo.scss";

const UpdateInfo = () => {
  const [customer, setCustomer] = useState({
    userName: '',
    phone: '',
    address: '',
    dob: ''
  });
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

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("accessToken"));
    
    try {
      await axios.put(`${MainAPI}/Customer/${customer.customerId}`, customer, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Information updated successfully!");
      navigate('/customer-account'); // Redirect back to profile page
    } catch (error) {
      console.error("Error updating customer info:", error);
      toast.error("Failed to update information. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "120px" }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  return (
    <div className="update-info-page">
       <div className="header-footer-wrapper">
        <HeaderPage />
      </div>
      <div className="update-info-container">
        <h2>Update Profile</h2>
        <form onSubmit={handleSubmit} className="update-info-form">
          <div className="form-group">
            <label>Customer Name:</label>
            <input 
              type="text" 
              name="userName" 
              value={customer.userName} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Number phone:</label>
            <input 
              type="text" 
              name="phone" 
              value={customer.phone} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input 
              type="text" 
              name="address" 
              value={customer.address} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Date of birth:</label>
            <input 
              type="date" 
              name="dob" 
              value={customer.dob} 
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="update-info-button">Update</button>
        </form>
      </div>
      <div className="header-footer-wrapper">
        <FooterPage />
      </div>
    </div>
  );
};

export default UpdateInfo;
