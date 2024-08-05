import React from "react";
import "./ModalVoucher.scss";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { MainAPI } from "../../components/API";
import useAuth from "../../hooks/useAuth";
import useOrder from "../../hooks/useOrder";

export default function ModalVoucher({
  closeModal,
  listOfVoucher,
  isUsedVoucher,
}) {
  const { auth } = useAuth();
  const { setOrderInfomation } = useOrder();
  const handleApplyVoucher = (e) => {
    axios
      .post(
        `${MainAPI}/user/apply-voucher`,
        {
          user_id: auth.user.user_id,
          voucher_id: e.target.value,
        },
        {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        const discount = res.data.voucher.discount / 100;
        setOrderInfomation({ discount });
        isUsedVoucher();
        closeModal();
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.errors[0].message);
      });
  };

  return (
    <div
      className="modal-container-voucher"
      onClick={(e) => {
        if (e.target.className === "modal-container-voucher") {
          closeModal();
        }
      }}
    >
      <div className="modal-content">
        {/* <ToastContainer autoClose={2000} /> */}
        <h3 className="d-flex justify-content-start">Voucher của bạn</h3>
        {listOfVoucher.map((voucher) => (
          <div
            key={voucher.code}
            style={{
              textAlign: "center",
              // background: "red",
              padding: "5px 0",
              fontSize: "20px",
            }}
            className="each-slide"
          >
            <div className="first-part">
              <p className="fw-bold">{voucher.discount}%</p>
            </div>

            <div className="second-part">
              <p style={{ fontSize: "15px" }} className="fw-bold">
                Tất cả sản phẩm
              </p>
              <p style={{ fontSize: "13px" }}>{voucher.code}</p>
              <div className="m-0">
                <span style={{ fontSize: "13px" }}>
                  HSD:{voucher.expiration_date}
                </span>
                {voucher.used ? (
                  <>
                    {" "}
                    <button
                      className="btn btn-danger fw-bold "
                      style={{
                        borderRadius: "20px",
                        color: "Black",
                        backgroundColor: "#F5F7FD",
                        margin: 0,
                      }}
                      value={voucher.voucher_id}
                    >
                      Đã sử dụng
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-danger fw-bold px-4 "
                      style={{
                        borderRadius: "20px",
                        color: "white",
                        backgroundColor: "#ff0064",
                        margin: 0,
                      }}
                      value={voucher.voucher_id}
                      onClick={handleApplyVoucher}
                    >
                      Áp dụng
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
