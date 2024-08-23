import React, { useState, useEffect } from "react";
import "./PreOrderPage.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import { jwtDecode } from "jwt-decode";
import { MainAPI } from "../../API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formatVND } from "../../../utils/Format";

const PreOrderPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [shippingAddress, setShippingAddress] = useState("");
    const [orderCustomerName, setOrderCustomerName] = useState("");
    const [orderCustomerPhone, setOrderCustomerPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    const token = JSON.parse(localStorage.getItem("accessToken"));
    const decodedToken = jwtDecode(token);
    const customerId = decodedToken.customerId;

    const fetchCustomerInfo = async () => {
        try {
            const response = await axios.get(
                `${MainAPI}/Customer/${customerId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                const customerData = response.data;
                setShippingAddress(customerData.address || "");
                setOrderCustomerName(customerData.userName || "");
                setOrderCustomerPhone(customerData.phone || "");
            } else {
                setError("Failed to fetch customer information.");
            }
        } catch (error) {
            console.error("Error fetching customer information:", error);
            setError("Failed to fetch customer information.");
        }
    };

    useEffect(() => {
        fetchCustomerInfo();
    }, [customerId, token]);

    const fetchProductInfo = async () => {
        try {
            const response = await axios.get(
                `${MainAPI}/Product/get-product-by-id/${productId}`
            );
            if (response.status === 200) {
                setProduct(response.data);
            } else {
                setError("Failed to fetch product information.");
            }
        } catch (error) {
            console.error("Error fetching product information:", error);
            setError("Failed to fetch product information.");
        }
    };

    useEffect(() => {
        fetchProductInfo();
    }, [productId]);
    useEffect(() => {
        if (editMode) {
            const fetchProvinces = async () => {
                try {
                    const response = await axios.get(
                        "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json"
                    );
                    setProvinces(response.data);
                } catch (error) {
                    console.error("Error fetching provinces:", error);
                }
            };

            fetchProvinces();

            setOrderCustomerName("");
            setOrderCustomerPhone("");
            setShippingAddress("");
            setSelectedProvince("");
            setSelectedDistrict("");
            setSelectedWard("");
        }
    }, [editMode]);
    const handleProvinceChange = (e) => {
        const selected = e.target.value;
        setSelectedProvince(selected);
        setSelectedDistrict("");
        setSelectedWard("");
        const provinceData = provinces.find(prov => prov.Name === selected);
        setDistricts(provinceData ? provinceData.Districts : []);
    };

    const handleDistrictChange = (e) => {
        const selected = e.target.value;
        setSelectedDistrict(selected);
        setSelectedWard("");
        const districtData = districts.find(dist => dist.Name === selected);
        setWards(districtData ? districtData.Wards : []);
    };

    const handleWardChange = (e) => {
        setSelectedWard(e.target.value);
    };

    const handlePreOrder = async () => {
        if (!quantity || quantity < 1) {
            toast.error("Quantity must be at least 1.");
            return;
        }
        if (!orderCustomerName.trim()) {
            toast.error("Customer name is required.");
            return;
        }
        if (!orderCustomerPhone.trim() || !/^\d+$/.test(orderCustomerPhone.trim())) {
            toast.error("Phone number is required, and must contain only digits.");

            return;
        }
        if (!shippingAddress.trim()) {
            toast.error("Shipping address is required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${MainAPI}/Order/create-order`,
                {
                    customerId,
                    productId,
                    quantity,
                    shippingAddress: editMode
                        ? `${shippingAddress}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`
                        : shippingAddress,
                    orderCustomerName,
                    orderCustomerPhone,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 || response.status === 201) {
                window.open(response.data.url, "_blank");
            } else {
                setError("Failed to place order. Please try again.");
            }
        } catch (error) {
            console.error("Error placing order:", error);
            setError("Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        setEditMode(false);
        fetchCustomerInfo();
    };

    return (
        <div className="pre-order-page">
            <HeaderPage />
            <ToastContainer />
            <div className="pre-order-content">
                <div className="product-info">
                    {product ? (
                        <>
                            <img src={product.images[0]?.imageProduct1} alt={product.productName} />
                            <h3>Product Name: {product.productName}</h3>
                            <p><strong>Description: </strong>{product.productInfor}</p>
                            <p><strong>Price: </strong>{formatVND(product.productPrice)}</p>
                        </>
                    ) : (
                        <p>Loading product information...</p>
                    )}
                </div>
                <div className="order-form">
                    <h2>Pre-order Form</h2>
                    <div className="form-group">
                        <label htmlFor="quantity">Quantity:</label>
                        <input
                            id="quantity"
                            type="number"
                            value={quantity}
                            min="1"
                            onChange={(e) => setQuantity(e.target.value)}
                        />
                    </div>

                    {!editMode ? (
                        <div className="customer-info">
                            <p><strong>Name:</strong> {orderCustomerName}</p>
                            <p><strong>Phone:</strong> {orderCustomerPhone}</p>
                            <p><strong>Address:</strong> {shippingAddress}</p>
                            <div className="btn-container">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setEditMode(true)}
                                >
                                    Enter a different address
                                </button>
                                <button
                                    className="btn btn-pre-order"
                                    onClick={handlePreOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Placing Order..." : "Place Pre-order"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="form-group">
                                <label htmlFor="orderCustomerName">Customer Name:</label>
                                <input
                                    id="orderCustomerName"
                                    type="text"
                                    value={orderCustomerName}
                                    onChange={(e) => setOrderCustomerName(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="orderCustomerPhone">Customer Phone:</label>
                                <input
                                    id="orderCustomerPhone"
                                    type="text"
                                    value={orderCustomerPhone}
                                    onChange={(e) => setOrderCustomerPhone(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="province">Province:</label>
                                <select
                                    id="province"
                                    value={selectedProvince}
                                    onChange={handleProvinceChange}
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map((province) => (
                                        <option key={province.Name} value={province.Name}>
                                            {province.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="district">District:</label>
                                <select
                                    id="district"
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedProvince}
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.Name} value={district.Name}>
                                            {district.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="ward">Ward:</label>
                                <select
                                    id="ward"
                                    value={selectedWard}
                                    onChange={handleWardChange}
                                    disabled={!selectedDistrict}
                                >
                                    <option value="">Select Ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.Name} value={ward.Name}>
                                            {ward.Name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="shippingAddress">Detailed Address:</label>
                                <input
                                    id="shippingAddress"
                                    type="text"
                                    value={shippingAddress}
                                    onChange={(e) => setShippingAddress(e.target.value)}
                                    placeholder="Enter your house number, street name, etc."
                                />
                            </div>
                            <div className="btn-container">
                                <button
                                    className="btn-cancel"
                                    onClick={handleCancel}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-pre-order"
                                    onClick={handlePreOrder}
                                    disabled={loading}
                                >
                                    {loading ? "Placing Order..." : "Place Pre-order"}
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>
            <FooterPage />
        </div>
    );
};

export default PreOrderPage;
