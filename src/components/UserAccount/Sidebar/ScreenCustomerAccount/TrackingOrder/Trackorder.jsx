import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MainAPI } from "../../../../API";
import useAuth from "../../../../../hooks/useAuth";
import Header from "../../../../../utils/Header/Header";
import FooterPage from "../../../../../utils/Footer/FooterPage";
import { MdOutlinePendingActions } from "react-icons/md";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { FaMotorcycle } from "react-icons/fa6";
import { IoBagCheck } from "react-icons/io5";
import { MdCancel } from "react-icons/md";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { TiPencil } from "react-icons/ti";
import { Spinner } from "react-bootstrap";

export default function Trackorder() {
  const nav = useNavigate();
  const { id } = useParams();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  const [trackOrderList, setTrackOrderList] = useState([]);

  const handleBack = () => {
    nav("/customer-account");
  };

  const fetchData = () => {
    fetch(`${MainAPI}/order/get-order-all-status-by-user-id/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
      body: JSON.stringify({ user_id: auth.user.user_id }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data get order");
        return res.json();
      })
      .then((data) => {
        setTrackOrderList(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching data order:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(trackOrderList);

  return (
    <div>
      <Header />
      <button
        className="btn btn-primary"
        style={{
          margin: "7% 0px 2% 3%",
          padding: "6px 30px",
          borderRadius: "10px",
          border: "none",
          color: "white",
        }}
        onClick={handleBack}
      >
        <FaLongArrowAltLeft /> Quay Lại
      </button>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div
          style={{
            border: "1px solid  #999999",
            width: "80%",
            textAlign: "left",
            borderRadius: "20px",
            boxShadow: "1px 1px 10px 4px  #999999",
          }}
          className="container"
        >
          {trackOrderList
            .filter((order) => order.order_id === parseInt(id))
            .map((order) => (
              <div key={order.order_id} style={{ margin: "2% 0px 15% 0px" }}>
                <p style={{ fontSize: "30px" }}>
                  Mã đơn hàng: {order.order_id}
                </p>
                <p>
                  Ngày đặt hàng:{" "}
                  {new Date(order.order_date).toLocaleDateString("vi-VN", {
                    day: "numeric",
                    month: "numeric",
                    year: "numeric",
                  })}
                </p>
                {order.status === "Completed" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "80px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <MdOutlinePendingActions color="#67b14e" />
                        </span>
                        <span>Chờ thanh toán</span>
                      </div>
                      &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMoneyCheckDollar color="#67b14e" />
                        </span>
                        <span>Thanh Toán</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaBox color="#67b14e" />
                        </span>
                        <span>Chờ giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMotorcycle color="#67b14e" />
                        </span>
                        <span>Đang giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <IoBagCheck color="#67b14e" />
                        </span>
                        <span>Đã giao</span>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </>
                )}

                {order.status === "Confirmed" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "80px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <MdOutlinePendingActions color="#67b14e" />
                        </span>
                        <span>Chờ thanh toán</span>
                      </div>
                      &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMoneyCheckDollar color="#67b14e" />
                        </span>
                        <span>Thanh Toán</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaBox color="#67b14e" />
                        </span>
                        <span>Chờ giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMotorcycle />
                        </span>
                        <span>Đang giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <IoBagCheck />
                        </span>
                        <span>Đã giao</span>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </>
                )}

                {order.status === "Delivered" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "80px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <MdOutlinePendingActions color="#67b14e" />
                        </span>
                        <span>Chờ thanh toán</span>
                      </div>
                      &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMoneyCheckDollar color="#67b14e" />
                        </span>
                        <span>Thanh Toán</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaBox color="#67b14e" />
                        </span>
                        <span>Chờ giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMotorcycle color="#67b14e" />
                        </span>
                        <span>Đang giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <IoBagCheck />
                        </span>
                        <span>Đã giao</span>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </>
                )}

                {order.status === "pending" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "80px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <MdOutlinePendingActions color="#67b14e" />
                        </span>
                        <span>Chờ thanh toán</span>
                      </div>
                      &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMoneyCheckDollar />
                        </span>
                        <span>Thanh Toán</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaBox />
                        </span>
                        <span>Chờ giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMotorcycle />
                        </span>
                        <span>Đang giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <IoBagCheck />
                        </span>
                        <span>Đã giao</span>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </>
                )}

                {order.status === "paid" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "80px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <MdOutlinePendingActions color="#67b14e" />
                        </span>
                        <span>Chờ thanh toán</span>
                      </div>
                      &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid green",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMoneyCheckDollar color="#67b14e" />
                        </span>
                        <span>Thanh Toán</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaBox />
                        </span>
                        <span>Chờ giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMotorcycle />
                        </span>
                        <span>Đang giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <IoBagCheck />
                        </span>
                        <span>Đã giao</span>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </>
                )}

                {order.status === "Cancelled" && (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "80px",
                      }}
                    >
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <MdOutlinePendingActions />
                        </span>
                        <span>Chờ thanh toán</span>
                      </div>
                      &nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMoneyCheckDollar />
                        </span>
                        <span>Thanh Toán</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaBox />
                        </span>
                        <span>Chờ giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <FaMotorcycle />
                        </span>
                        <span>Đang giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <IoBagCheck />
                        </span>
                        <span>Đã giao</span>
                      </div>
                      &nbsp;&nbsp;
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            border: "1px solid black",
                            width: "100px",
                          }}
                        ></span>
                        <span style={{ marginTop: "-2%" }}>&#62;</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "70px" }}>
                          {" "}
                          <MdCancel color="red" />
                        </span>
                        <span>Đã Hủy</span>
                      </div>
                      &nbsp;&nbsp;
                    </div>
                  </>
                )}

                {order.status === "Cancelled" ? (
                  <p
                    style={{
                      textAlign: "left",
                      marginLeft: "20px",
                      marginTop: "5%",
                      marginBottom: "-13%",
                    }}
                  >
                    <TiPencil size="25px" /> Đơn hàng đã được hủy
                  </p>
                ) : (
                  <p
                    style={{
                      textAlign: "left",
                      marginLeft: "20px",
                      marginTop: "5%",
                      marginBottom: "-13%",
                    }}
                  >
                    <TiPencil size="25px" /> Đơn hàng dự kiến sẽ được giao tới
                    người mua sau 3 ngày <br />
                    kể từ ngày đơn hàng được xác nhận.
                  </p>
                )}
              </div>
            ))}
        </div>
      )}
      <FooterPage />
    </div>
  );
}
