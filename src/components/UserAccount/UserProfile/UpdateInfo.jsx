import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { MainAPI } from "../../API";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import "./UpdateInfo.scss";

const UpdateInfo = () => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCustomerProfile = async () => {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      if (!token) {
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userName: customer?.userName || '',
      phone: customer?.phone || '',
      address: customer?.address || '',
      dob: customer?.dob || '',
    },
    validationSchema: Yup.object({
      userName: Yup.string().required('Customer name is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^\d{10}$/, 'Phone number must be 10 digits'),
      address: Yup.string().required('Address is required'),
      dob: Yup.date().required('Date of birth is required'),
    }),
    onSubmit: async (values) => {
      const token = JSON.parse(localStorage.getItem("accessToken"));

      try {
        await axios.put(`${MainAPI}/Customer/${customer.customerId}`, values, {
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
    },
  });

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
        <form onSubmit={formik.handleSubmit} className="update-info-form">
          <div className="form-group">
            <label>Customer Name:</label>
            <input
              type="text"
              name="userName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.userName}
            />
            {formik.touched.userName && formik.errors.userName ? (
              <div className="error-message">{formik.errors.userName}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label>Number phone:</label>
            <input
              type="text"
              name="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone ? (
              <div className="error-message">{formik.errors.phone}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address ? (
              <div className="error-message">{formik.errors.address}</div>
            ) : null}
          </div>
          <div className="form-group">
            <label>Date of birth:</label>
            <input
              type="date"
              name="dob"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.dob}
            />
            {formik.touched.dob && formik.errors.dob ? (
              <div className="error-message">{formik.errors.dob}</div>
            ) : null}
          </div>
          <button type="submit" className="update-info-button">
            Update
          </button>
        </form>
      </div>
      <div className="header-footer-wrapper">
        <FooterPage />
      </div>
    </div>
  );
};

export default UpdateInfo;
