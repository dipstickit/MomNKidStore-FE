import React, { useEffect, useState } from "react";
import ModalVoucher from "../../../utils/ModalVoucher/ModalVoucher";
import axios from "axios";
import { MainAPI } from "../../API";
import useAuth from "../../../hooks/useAuth";

const DiscountSection = () => {
  const [show, setShow] = useState(false);
  const [isUsedVoucher, setIsUsedVoucher] = useState(false);
  const [listOfVoucherById, setListOfVoucherById] = useState([]);
  const { auth } = useAuth();

  useEffect(() => {
    axios
      .get(`${MainAPI}/user/show-voucher-by-user/${auth.user.user_id}`, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        console.log(res.data.vouchers);
        setListOfVoucherById(res.data.vouchers.vouchers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="discount-section">
      {isUsedVoucher ? (
        <>
          <button
            className="btn"
            style={{ borderColor: "#ff4081", backgroundColor: "#ffe6f0" }}
            onClick={() => {
              setShow(true);
            }}
          >
            Đã áp dụng 1 voucher
          </button>
        </>
      ) : (
        <>
          {" "}
          <button
            className="btn btn-primary"
            onClick={() => {
              setShow(true);
            }}
          >
            Sử dụng mã giảm giá
          </button>
        </>
      )}

      {/* MODAL */}
      {show && (
        <ModalVoucher
          listOfVoucher={listOfVoucherById}
          isUsedVoucher={() => {
            setIsUsedVoucher(true);
          }}
          closeModal={() => {
            setShow(false);
          }}
          onSubmit={() => {}}
          errors={[]}
        />
      )}
    </div>
  );
};

export default DiscountSection;
