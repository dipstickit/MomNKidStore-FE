import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import { MainAPI } from "../../API";
import { convertSQLDate, formatVND } from "../../../utils/Format";
import "./TrackOrderDetail.scss";

export default function OrderDetail() {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [customerName, setCustomerName] = useState("");
    const [loading, setLoading] = useState(true);
    const token = JSON.parse(localStorage.getItem("accessToken"));

    const fetchCustomerName = async (customerId) => {
        try {
            const res = await fetch(`${MainAPI}/Customer/${customerId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!res.ok) throw new Error(`Failed to fetch customer data for ID ${customerId}`);
            const data = await res.json();
            return data.userName;
        } catch (error) {
            console.error("Error fetching customer data:", error);
            return "Unknown Customer";
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

                const customerName = await fetchCustomerName(data.customerId);
                setCustomerName(customerName);

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

    return (
        <div className="orderDetail-container">
            <h1>Order Detail - #{order.orderId}</h1>
            <div className="order-info">
                <p><strong>Order Date:</strong> {convertSQLDate(order.orderDate)}</p>
                <p><strong>Customer Name:</strong> {customerName}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total Price:</strong> {formatVND(order.totalPrice)}</p>
                <p><strong>Voucher ID:</strong> {order.voucherId ? order.voucherId : "N/A"}</p>
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
