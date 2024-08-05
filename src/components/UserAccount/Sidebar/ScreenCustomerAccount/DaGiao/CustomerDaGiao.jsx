import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainAPI } from "../../../../API";
import { formatVND } from "../../../../../utils/Format";
import ModalReview from "../ModalReview/ModalReview";
import useAuth from "../../../../../hooks/useAuth";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./CompletedOrder.scss";
import { Spinner } from "react-bootstrap";

export default function CustomerDaGiao({ title }) {
  const [completeOrderList, setCompleteOrderList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalReportOpen, setModalReportOpen] = useState(false);
  const [productDetail, setProductDetail] = useState({});
  const { auth } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .post(`${MainAPI}/order/get-order-by-user-id/`, {
        user_id: auth.user.user_id,
      })
      .then((res) => {
        // console.log(res);
        setCompleteOrderList(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSubmit = (feedback) => {
    console.log(feedback);
  };

  const handTrackOrder = (id) => {
    console.log(id);
    nav(`/trackorder/${id}`);
  };

  console.log(completeOrderList);

  return (
    <div className={title === "Đã giao" ? "dagiao" : "fade"}>
      {/* <ToastContainer /> */}
      <h5 className="fw-bold">{title}</h5>
      {loading ? (
        <>
          {" "}
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        </>
      ) : (
        <>
          {completeOrderList.length === 0 ? (
            <div className="emptyinfo">
              <img src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Faccount%2Fdanggiao.png?alt=media&token=c31a1c88-3ed9-4d03-b8d5-daabd9cf7992" />
              <p>
                Hiện chưa có sản phẩm <br />
                nào đã giao
              </p>
            </div>
          ) : (
            completeOrderList.map((dagiao, index) => {
              return (
                <div key={dagiao.order_id} className="order">
                  <div style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-primary m-0"
                      style={{
                        border: "none",
                        borderRadius: "10px",
                        color: "white",
                        padding: "10px",
                      }}
                      onClick={() => handTrackOrder(dagiao.order_id)}
                    >
                      Order Progress
                    </button>
                  </div>
                  {dagiao.products.map((product, index) => {
                    return (
                      <div key={index} className="tab-content">
                        <div className="cart-product-line d-flex">
                          <div className="product-img">
                            <img src={product.image_url} alt="1" />
                          </div>
                          <div className="product-info w-100">
                            <div className="item-cart-product-name">
                              {product.product_name}
                            </div>
                            <div className="d-flex w-100 align-center product-info-bottom">
                              <span style={{ width: 600 }}></span>
                              <div className="item-cart-quantity-pro">
                                x{product.quantity}
                              </div>
                              &nbsp;
                              <div className="item-cart-price-pro mr-0">
                                {formatVND(product.price)}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="d-flex justify-content-end">
                          <div className="mt-3 ">
                            <button
                              className="btn btn-warning m-0"
                              onClick={() => {
                                setModalReportOpen(true);
                                setProductDetail(product);
                              }}
                            >
                              Report
                            </button>
                            {modalReportOpen && (
                              <ModalReview
                                report={true}
                                order_id={dagiao.order_id}
                                product={productDetail}
                                closeModal={() => {
                                  setModalReportOpen(false);
                                }}
                                onSubmit={handleSubmit}
                              />
                            )}
                          </div>
                          <div className=" mt-3 ms-3">
                            <button
                              className="btn btn-warning m-0"
                              onClick={() => {
                                setModalOpen(true);
                                setProductDetail(product);
                              }}
                            >
                              Đánh giá
                            </button>
                            {modalOpen && (
                              <ModalReview
                                order_id={dagiao.order_id}
                                product={productDetail}
                                closeModal={() => {
                                  setModalOpen(false);
                                }}
                                onSubmit={handleSubmit}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div className="px-20 container font-13 mt-20 color-20 pb-20 line-height-13 border-top-f2 block-end">
                    <span className="d-flex w-100 align-center justify-content-between">
                      <span className="w-50">
                        <span className="color-20">Có </span>
                        <span className="font-bold font-15 line-height-15 color-20">
                          {dagiao.products.length} sản phẩm
                        </span>
                      </span>
                      <span
                        className="d-flex justify-content-between align-items-end"
                        style={{ width: 180 }}
                      >
                        <span>Tiền tích lũy</span>
                        <span className="font-bold font-15 line-height-15 cc-pink-primary">
                          100000đ
                        </span>
                      </span>
                    </span>
                    <span className="d-flex align-center align-items-end w-100 justify-content-between">
                      <span className="w-50 align-items-end d-flex">
                        <span>Mã đơn </span>
                        <span className="font-bold font-15 d-inline-flex align-items-end color-20">
                          #{dagiao.order_id}
                        </span>
                      </span>
                      <span className="d-flex align-items-end justify-content position-relative color-20 font-13">
                        <span
                          className="d-flex align-items-end justify-content position-relative color-20 font-13"
                          style={{ width: 115 }}
                        >
                          Thành tiền
                        </span>
                        <span className="font-bold font-15 line-height-15 color-20">
                          {formatVND(dagiao.total_amount)}
                        </span>
                      </span>
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </>
      )}
    </div>
  );
}
