import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import "./CustomerProfile.scss"; // Import the CSS file for styling
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function CustomerProfile() {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCustomer = async (customerId, token) => {
    try {
      const response = await axios.get(`http://54.151.230.5:5173/api/v1/Customer/${customerId}`, {
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
        const decodedToken = jwtDecode(token); // Decode the token to get the customer ID
        const customerId = decodedToken.customerId; // Assuming customerId is stored in the token

        const customerData = await fetchCustomer(customerId, token);
        if (customerData) {
          setCustomer(customerData);
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
    <div className="container">
      <ToastContainer autoClose={2000} />
      <h2>Customer Profile</h2>
      <div className="profile-details">
        <p><strong>Username:</strong> {customer.userName}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
        <p><strong>Address:</strong> {customer.address}</p>
        <p><strong>Date of Birth:</strong> {customer.dob}</p>
        <p><strong>Points:</strong> {customer.point}</p>
      </div>
    </div>
  );
}
