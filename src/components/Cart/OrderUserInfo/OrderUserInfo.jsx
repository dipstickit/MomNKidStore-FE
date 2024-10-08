import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { usePrice } from '../PriceContext';
import './OrderUserInfo.scss';
import { MainAPI } from '../../API';
import useAuth from '../../../hooks/useAuth';
import PaymentOptions from '../PaymentOptions/PaymentOptions';

export default function OrderUserInfo() {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState("VNPAY");
  const [editMode, setEditMode] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    customerName: '',
    customerPhone: '',
    province: '',
    district: '',
    ward: '',
    shippingAddress: '',
  });

  const { totalPrice, updateTotalPrice, voucherID, isExchangedPoint } = usePrice();
  const { auth } = useAuth();
  const nav = useNavigate();

  const fetchCartItems = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      try {
        const cartResponse = await axios.get(`${MainAPI}/Cart`, {
          params: { CustomerId: customerId },
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(
          cartResponse.data.cartItems.map((item) => ({
            cartId: item.cartId,
            customerId: item.customerId,
            productId: item.productId,
            quantity: item.cartQuantity,
          }))
        );
        updateTotalPrice(cartResponse.data.totalPrice);

        const customerResponse = await axios.get(`${MainAPI}/Customer/${customerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomerInfo(customerResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
        );
        setProvinces(response.data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocations();
    fetchCartItems();
  }, []);

  const formik = useFormik({
    initialValues: {
      customerName: customerInfo.customerName || "",
      customerPhone: customerInfo.customerPhone || "",
      province: customerInfo.province || "",
      district: customerInfo.district || "",
      ward: customerInfo.ward || "",
      shippingAddress: customerInfo.shippingAddress || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      customerName: Yup.string().required("Name is required"),
      customerPhone: Yup.string()
        .required("Phone is required")
        .matches(/^0\d{9}$/, "Phone must be 10 digits and start with 0"),
      province: Yup.string().required("Province is required"),
      district: Yup.string().required("District is required"),
      ward: Yup.string().required("Ward is required"),
      shippingAddress: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values) => {
      const token = JSON.parse(localStorage.getItem("accessToken"));

      const orderData = {
        cartItems: cartItems,
        totalPrice: totalPrice,
        voucherID: voucherID,
        isExchangedPoint: isExchangedPoint,
        shippingAddress: `${values.shippingAddress}, ${values.ward}, ${values.district}, ${values.province}`,
        orderCustomerName: values.customerName,
        orderCustomerPhone: values.customerPhone,
        paymentMethod: selectedMethod,
      };

      try {
        const response = await axios.post(`${MainAPI}/Order/create-order-in-cart`, orderData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        window.open(response.data.url, "_blank");
        console.log("Order created:", response.data);
      } catch (error) {
        console.error("Error creating order:", error);
        toast.error("An error occurred while creating the order.");
      }
    },
  });

  const handleDirectOrder = async () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));

    const orderData = {
      cartItems: cartItems,
      totalPrice: totalPrice,
      voucherID: voucherID,
      isExchangedPoint: isExchangedPoint,
      shippingAddress: customerInfo.address,
      orderCustomerName: customerInfo.userName,
      orderCustomerPhone: customerInfo.phone,
      paymentMethod: selectedMethod,
    };

    try {
      const response = await axios.post(`${MainAPI}/Order/create-order-in-cart`, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.open(response.data.url, "_blank");
      console.log("Order created:", response.data);
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An error occurred while creating the order.");
    }
  };

  useEffect(() => {
    if (formik.values.province) {
      const provinceData = provinces.find(
        (province) => province.Name === formik.values.province
      );
      setDistricts(provinceData ? provinceData.Districts : []);
      formik.setFieldValue("district", "");
      formik.setFieldValue("ward", "");
      setWards([]);
    }
  }, [formik.values.province, provinces]);

  useEffect(() => {
    if (formik.values.district) {
      const districtData = districts.find(
        (district) => district.Name === formik.values.district
      );
      setWards(districtData ? districtData.Wards : []);
    }
  }, [formik.values.district, districts]);

  return (
    <div className="order-user-info">
      <h2>Order Information</h2>
      <PaymentOptions setSelectedMethod={setSelectedMethod} />
      <div className="customer-info">
        {!editMode && customerInfo.userName && customerInfo.phone && customerInfo.address ? (
          <>
            <p><strong>Name:</strong> {customerInfo.userName}</p>
            <p><strong>Phone:</strong> {customerInfo.phone}</p>
            <p><strong>Address:</strong> {customerInfo.address}</p>
            <button type="button" className="btn btn-secondaryy" onClick={() => setEditMode(true)}>
              Update Information
            </button>
            <button type="button" className="btn btn-primaryy" onClick={handleDirectOrder}>
              Confirm
            </button>
          </>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label htmlFor="customerName">Name</label>
              <input
                type="text"
                id="customerName"
                {...formik.getFieldProps("customerName")}
                className={formik.touched.customerName && formik.errors.customerName ? "error" : ""}
              />
              {formik.touched.customerName && formik.errors.customerName ? (
                <div className="error-message">{formik.errors.customerName}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="customerPhone">Phone</label>
              <input
                type="text"
                id="customerPhone"
                {...formik.getFieldProps("customerPhone")}
                className={formik.touched.customerPhone && formik.errors.customerPhone ? "error" : ""}
              />
              {formik.touched.customerPhone && formik.errors.customerPhone ? (
                <div className="error-message">{formik.errors.customerPhone}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="province">Province</label>
              <select
                id="province"
                {...formik.getFieldProps("province")}
                className={formik.touched.province && formik.errors.province ? "error" : ""}
              >
                <option value="">Select Province</option>
                {provinces.map((province) => (
                  <option key={province.Name} value={province.Name}>
                    {province.Name}
                  </option>
                ))}
              </select>
              {formik.touched.province && formik.errors.province ? (
                <div className="error-message">{formik.errors.province}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="district">District</label>
              <select
                id="district"
                {...formik.getFieldProps("district")}
                disabled={!formik.values.province}
                className={formik.touched.district && formik.errors.district ? "error" : ""}
              >
                <option value="">Select District</option>
                {districts.map((district) => (
                  <option key={district.Name} value={district.Name}>
                    {district.Name}
                  </option>
                ))}
              </select>
              {formik.touched.district && formik.errors.district ? (
                <div className="error-message">{formik.errors.district}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="ward">Ward</label>
              <select
                id="ward"
                {...formik.getFieldProps("ward")}
                disabled={!formik.values.district}
                className={formik.touched.ward && formik.errors.ward ? "error" : ""}
              >
                <option value="">Select Ward</option>
                {wards.map((ward) => (
                  <option key={ward.Name} value={ward.Name}>
                    {ward.Name}
                  </option>
                ))}
              </select>
              {formik.touched.ward && formik.errors.ward ? (
                <div className="error-message">{formik.errors.ward}</div>
              ) : null}
            </div>
            <div className="form-group">
              <label htmlFor="shippingAddress">Detailed Address</label>
              <input
                type="text"
                id="shippingAddress"
                {...formik.getFieldProps("shippingAddress")}
                className={formik.touched.shippingAddress && formik.errors.shippingAddress ? "error" : ""}
                placeholder="Enter your house number, street name, etc."
              />
              {formik.touched.shippingAddress && formik.errors.shippingAddress ? (
                <div className="error-message">{formik.errors.shippingAddress}</div>
              ) : null}
            </div>
            <button type="submit" className="btn btn-primary">
              Place Order
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                setEditMode(false);
              }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
