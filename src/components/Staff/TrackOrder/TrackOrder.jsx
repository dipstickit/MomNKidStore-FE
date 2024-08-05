import React, { useEffect, useState } from "react";
import "./TrackOrder.scss";
import { MainAPI } from "../../API";
import { convertSQLDate, formatVND } from "../../../utils/Format";
import { Spinner } from "react-bootstrap";

export default function TrackOrder() {
  const [trackOrderList, setTrackOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch(`${MainAPI}/staff/order`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data get order");
        return res.json();
      })
      .then((data) => {
        setTrackOrderList(data);
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

  return (
    <div>
      {
        loading ? (
          <>
            <div className=" spinner-track">
              <Spinner animation="border" role="status" />
            </div>
          </>
        ) : (
          <>
            <div className="track">
              <div className="track-th">
                <table className="table-track-th">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer Name</th>
                      <th>Status</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="track-tb">
                <table className="table-track-tb">
                  <tbody>
                    {trackOrderList.map((confirm) => (
                      <tr key={confirm.order_id}>
                        <td>{confirm.order_id}</td>
                        <td>{convertSQLDate(confirm.order_date)}</td>
                        <td>{confirm.username}</td>
                        <td className={getStatusClass(confirm.status)}>
                          <span className="status-dot"></span>
                          {confirm.status}
                        </td>
                        <td>{formatVND(confirm.total_amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      }
    </div>
  );
}
