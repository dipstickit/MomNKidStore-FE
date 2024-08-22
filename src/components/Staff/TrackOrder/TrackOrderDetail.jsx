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
                return "Paid";
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
            case 20:
                return "Returning";
            case 21:
                return "Have Returned";
            default:
                return "Unknown";
        }
    };

    return (
        <div className="orderDetail-container">
            <div className="order-summary">
                <h1>Order Detail - #{order.orderId}</h1>
                <div className="order-info">
                    <p><strong>Mã đơn hàng:</strong> {order.orderId}</p>
                    <p><strong>Ngày:</strong> {convertSQLDate(order.orderDate)}</p>
                    <p><strong>Tổng tiền:</strong> {formatVND(order.totalPrice)}</p>
                    <p><strong>Trạng thái:</strong> <span className={`status ${getStatusClass(order.status).toLowerCase().replace(/\s+/g, '-')}`}>{getStatusClass(order.status).replace(/-/g, ' ')}</span></p>
                </div>
                {customer && (
                    <div className="customer-info">
                        <p><strong>Tên khách hàng:</strong> {customer.userName}</p>
                        <p><strong>Địa chỉ:</strong> {customer.address}</p>
                        <p><strong>Phone:</strong> {customer.phone}</p>
                    </div>
                )}
            </div>

            <h2>Sản phẩm đơn hàng</h2>
            <div className="order-items">
                {order.orderDetails.map((item, index) => (
                    <div key={index} className="order-item">
                        <img
                            src={item.product.images[0].imageProduct1}
                            alt={item.product.productName}
                            className="product-image"
                        />
                        <div className="item-info">
                            <p><strong>Tên sản phẩm:</strong> {item.product.productName}</p>
                            <p><strong>Số lượng:</strong> {item.orderQuantity}</p>
                            <p><strong>Giá:</strong> {formatVND(item.productPrice)}</p>
                            <p><strong>Tổng:</strong> {formatVND(item.orderQuantity * item.productPrice)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
