import React, { useEffect, useState } from "react";
import { FaWindowClose } from "react-icons/fa";
import { IoMdCheckbox } from "react-icons/io";
import "./ConfirmOrder.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainAPI } from "../../API";
import { convertSQLDate, formatVND } from "../../../utils/Format";
import { Spinner } from "react-bootstrap";

export default function ConfirmOrder() {
  const [loading, setLoading] = useState(true);

  const getStatusClass = (status) => {
    if (!status) return "";
    switch (status.toLowerCase()) {
      case "cancelled":
        return "status-cancel";
      case "completed":
        return "status-complete";
      case "pending":
        return "status-pending";
      case "delivered":
        return "status-delivered";
      case "confirmed":
        return "status-confirm";
      case "paid":
        return "status-paid";
      default:
        return "";
    }
  };

  const checkStatusIsPending = (status) => {
    if (!status) return false;
    return status.toLowerCase() === "paid";
  };

  const [dataConfirm, setDataConfirm] = useState([]);

  const fetchData = () => {
    setLoading(true);
    fetch(`${MainAPI}/staff/order`, {
      method: "GET",
      headers: {
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data get order");
        return response.json();
      })
      .then((data) => {
        setDataConfirm(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data order:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSetCancel = (confirm) => {
    fetch(`${MainAPI}/staff/cancel`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
      body: JSON.stringify({ order_id: confirm.order_id }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to cancel order");
        return response.json();
      })
      .then((data) => {
        setDataConfirm((prevData) =>
          prevData.map((item) =>
            item.order_id === confirm.order_id
              ? { ...item, status: data.status }
              : item
          )
        );
        toast.success("Order canceled successfully");
        fetchData();
      })
      .catch((error) => console.error("Error canceling order:", error));
  };

  const handleSetConfirm = (confirm) => {
    fetch(`${MainAPI}/staff/confirm`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
      body: JSON.stringify({ order_id: confirm.order_id }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to confirm order");
        return response.json();
      })
      .then((data) => {
        setDataConfirm((prevData) =>
          prevData.map((item) =>
            item.order_id === confirm.order_id
              ? { ...item, status: data.status }
              : item
          )
        );
        toast.success("Order confirmed successfully");
        fetchData();
      })
      .catch((error) => {
        console.error("Error confirming order:", error);
        toast.error("Hàng trong kho không đủ");
      });
  };

  return (
    < div >
      {
        loading ? (
          <div className=" spinner-order">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <div className="confirm">
            <ToastContainer />

            <div className="confirm-th">
              <table className="table-confirm-th">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Customer Name</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
              </table>
            </div>

            <div className="confirm-tb">

              <table className="table-confirm-tb">
                <tbody>
                  {dataConfirm.map((confirm) => (
                    <tr key={confirm.order_id}>
                      <td>{confirm.order_id}</td>
                      <td>{convertSQLDate(confirm.order_date)}</td>
                      <td>{confirm.username}</td>
                      <td className={getStatusClass(confirm.status)}>
                        <span className="status-dot"></span>
                        {confirm.status}
                      </td>
                      <td>{formatVND(confirm.total_amount)}</td>
                      {checkStatusIsPending(confirm.status) ? (
                        <td>
                          <button
                            className="action-btn-confirm"
                            onClick={() => handleSetConfirm(confirm)}
                            title="Xác nhận"
                          >
                            <IoMdCheckbox color="green" size="25px" />
                          </button>
                          <button
                            className="action-btn-cancel"
                            onClick={() => handleSetCancel(confirm)}
                            title="Hủy"
                          >
                            <FaWindowClose color="red" size="22px" />
                          </button>
                        </td>
                      ) : (
                        <td></td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        )
      }
    </div>
  );
}
