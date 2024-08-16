import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { MainAPI } from "../../API";
import { convertSQLDate, formatVND } from "../../../utils/Format";
import "./TrackOrderDetail.scss";

export default function OrderDetail() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = JSON.parse(localStorage.getItem("accessToken"));

    const fetchCustomerDetails = async (customerId) => {
        try {
            const res = await fetch(`${MainAPI}/Customer/${customerId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error(`Failed to fetch customer details for ID ${customerId}`);
            const data = await res.json();
            setCustomer(data);
        } catch (error) {
            console.error("Error fetching customer details:", error);
            setCustomer({});
        }
    };

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const res = await fetch(`${MainAPI}/Order/detail/${orderId}`, {
                    method: "GET",
                    headers: {
                        "x-access-token": token,
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!res.ok) throw new Error("Failed to fetch order details");
                const data = await res.json();
                setOrder(data);

                if (data.customerId) {
                    await fetchCustomerDetails(data.customerId);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching order details:", error);
                setLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId, token]);

    if (loading) {
        return (
            <div className="spinner-order-detail">
                <Spinner animation="border" role="status" />
            </div>
        );
    }

    if (!order) {
        return <div>Order not found</div>;
    }

    const getStatusClass = (status) => {
        switch (status) {
            case 0:
                return "Pending";
            case 1:
                return "Completed";
            case 2:
                return "Canceled";
            case 3:
                return "Delivered";
            case 4:
                return "Delivering";
            case 5:
                return "Refund";
            case 10:
                return "Preorder";
            case 11:
                return "Preorder-completed";
            case 12:
                return "Preorder-canceled";
            default:
                return "Unknown";
        }
    };

    return (
        <div className="orderDetail-container">
            <h1>Order Detail - #{order.orderId}</h1>
            <div className="order-info">
                <p><strong>Order Date:</strong> {convertSQLDate(order.orderDate)}</p>
                {customer && (
                    <>
                        <p><strong>Customer Name:</strong> {customer.userName}</p>
                        <p><strong>Address:</strong> {customer.address}</p>
                        <p><strong>Phone:</strong> {customer.phone}</p>
                    </>
                )}
                <p><strong>Status:</strong> <span className={`status ${getStatusClass(order.status).toLowerCase().replace(/\s+/g, '-')}`}>{getStatusClass(order.status).replace(/-/g, ' ')}</span></p>
                <p><strong>Total Price:</strong> {formatVND(order.totalPrice)}</p>
                <p><strong>Voucher ID:</strong> {order.voucherId || "N/A"}</p>
                <p><strong>Exchanged Points:</strong> {order.exchangedPoint}</p>
            </div>

            <h2>Order Items</h2>
            <div className="order-items">
                {order.orderDetails.map((item, index) => (
                    <div key={index} className="order-item">
                        <img
                            src={item.product.images[0].imageProduct1}
                            alt={item.product.productName}
                            className="product-image"
                        />
                        <div className="item-info">
                            <p><strong>Product Name:</strong> {item.product.productName}</p>
                            <p><strong>Product Info:</strong> {item.product.productInfor}</p>
                            <p><strong>Quantity:</strong> {item.orderQuantity}</p>
                            <p><strong>Price:</strong> {formatVND(item.productPrice)}</p>
                            <p><strong>Total:</strong> {formatVND(item.orderQuantity * item.productPrice)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
