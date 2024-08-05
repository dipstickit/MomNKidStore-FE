import React, { useEffect, useState } from "react";
import "./Voucher.scss";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useAuth from "../../../../hooks/useAuth";

export default function Voucher() {
  const [voucherList, setVoucherList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isGet, setIsGet] = useState({
    get: false,
    voucher_id: "",
  });
  const { auth } = useAuth();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/vouchers`)
      .then((res) => {
        setVoucherList(res.data.vouchers);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleClick = (e) => {
    try {
      axios
        .post(
          `http://localhost:5000/user/claim-voucher`,
          {
            user_id: auth.user.user_id,
            voucher_id: parseInt(e.target.value),
          },
          {
            headers: {
              "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
            },
          }
        )
        .then((res) => {
          setIsGet({
            get: true,
            voucher_id: e.target.value,
          });
          toast.success(res.data.message, {
            position: "bottom-right",
          });
        })
        .catch((err) => {
          console.log(err);
          toast.error(err.response.data.errors[0].message, {
            position: "bottom-right",
          });
        });
    } catch (err) {
      console.log(err);
      toast.error("Đăng nhập để nhận voucher", {
        position: "bottom-right",
      });
    }
  };

  return (
    <div className="voucher-container p-4">
      <h2 className="voucher-title mb-4">Nhận voucher</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Slide
          transitionDuration={200}
          slidesToScroll={1}
          slidesToShow={3}
          autoplay={false}
          responsive={[
            {
              breakpoint: 800,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {voucherList.map((voucher) => (
            <div key={voucher.code} className="each-slide">
              <div className="first-part">
                <p className="fw-bold">{voucher.discount}%</p>
              </div>
              <div className="second-part">
                <p className="fw-bold">Tất cả sản phẩm</p>
                <p>{voucher.code}</p>
                <div className="button-container">
                  <span>HSD: {voucher.expiration_date}</span>
                  {isGet.get && isGet.voucher_id === voucher.voucher_id ? (
                    <button
                      className="btn btn-danger fw-bold px-4"
                      onClick={() => navigate("/cart")}
                    >
                      Mua hàng
                    </button>
                  ) : (
                    <button
                      className="btn btn-danger fw-bold px-4"
                      style={{ marginLeft: "30px" }}
                      value={voucher.voucher_id}
                      onClick={handleClick}
                    >
                      Lấy mã
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slide>
      )}
      <ToastContainer />
    </div>
  );
}
