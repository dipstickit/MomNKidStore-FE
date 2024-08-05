import React, { useContext, useEffect, useState } from "react";
import "./OrderUserInfo.scss";
import axios from "axios";
import { MainAPI } from "../../API";
import useAuth from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import ModalVoucher from "../../../utils/ModalVoucher/ModalVoucher";
import useOrder from "../../../hooks/useOrder";
import { CartContext } from "../CartContext";
import { formatVND } from "../../../utils/Format";
import { FaBitcoin } from "react-icons/fa";
import { toast } from "react-toastify";

export default function OrderUserInfo() {
  const [show, setShow] = useState(false);
  const [listOfVoucherById, setListOfVoucherById] = useState([]);
  const [isUsedVoucher, setIsUsedVoucher] = useState(false);
  const [orderItem, setOrderItem] = useState({
    user_id: "",
    total_amount: 0,
    orderItems: [],
  });
  const [temporary, setTemporary] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [point, setPoint] = useState(0);
  const [userInformation, setUserInformation] = useState({});
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");

  const { orderInfomation, setOrderInfomation } = useOrder();
  const { cartList } = useContext(CartContext);
  const { auth } = useAuth();

  const nav = useNavigate();

  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  const validatePhone = (newPhone) => {
    const phoneRegex = /^0\d{9}$/;
    if (!phoneRegex.test(newPhone)) {
      setError("Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0");
      toast.error("Số điện thoại phải có đúng 10 chữ số và bắt đầu bằng số 0");
    } else {
      setError("");
    }
  };

  /* USEEFFECT GET VOUCHER BY USER ID */
  useEffect(() => {
    axios
      .get(`${MainAPI}/user/show-voucher-by-user/${auth.user.user_id}`, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        // console.log(res.data.vouchers.vouchers);
        setListOfVoucherById(res.data.vouchers.vouchers);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${MainAPI}/user/loyalty-points/${auth.user.user_id}`, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        // console.log(res);
        setPoint(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // USEEFFECT CALCULATE TOTAL
  useEffect(() => {
    const { temporaryTemp, discountTemp, totalTemp } = handleCalculate();

    setTemporary(temporaryTemp);
    setDiscount(discountTemp);
    setTotal(totalTemp);

    setOrderInfomation({
      ...orderInfomation,
      temporary: temporary,
      total: total,
    });
  }, [cartList, orderInfomation.discount, checked]);

  const handleClick = () => {
    if (!userInformation.phone || !userInformation.address) {
      toast.error("Vui lòng cập nhật thông tin giao hàng");
      return;
    }
    axios
      .post(`${MainAPI}/user/ready-to-checkout`, orderItem, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("preOrder", res.data.hasPreorder);
        localStorage.setItem(
          "total_amount",
          res.data.orderInfo[0].total_amount
        );
        // console.log(res.data.orderInfo[0].total_amount);

        setOrderInfomation({
          ...orderInfomation,
          order_id: res.data.order_id,
        });
        nav("/order-payment");
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });

    if (checked) {
      axios
        .put(
          `${MainAPI}/user/use-loyalty-points/${auth.user.user_id}`,
          {},
          {
            headers: {
              "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
            },
          }
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  //GET USERINFORMATION
  useEffect(() => {
    const getUserInformation = async () => {
      await axios
        .get(`${MainAPI}/user/show-all-phone-address/${auth.user.user_id}`, {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        })
        .then((res) => {
          console.log(res.data);
          setUserInformation(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    };
    getUserInformation();
  }, []);

  const handleUpdateUserInfo = () => {
    validatePhone(phone);
    axios
      .post(
        `${MainAPI}/user/add-phone-address`,
        { phone: phone, address: address, user_id: auth.user.user_id },
        {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        setUserInformation({
          ...userInformation,
          phone: phone,
          address: address,
        });
        toast.success(res.data.message);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  const handleCalculate = () => {
    const temporaryTemp = cartList.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    let discountTemp = orderInfomation.discount * temporaryTemp;
    if (isNaN(discountTemp)) {
      discountTemp = 0;
    }

    let totalTemp = temporaryTemp - discountTemp;

    if (checked) {
      totalTemp -= point;
    }

    setOrderItem({
      ...orderItem,
      total_amount: totalTemp,
      user_id: auth.user.user_id,
      orderItems: cartList,
    });

    return { temporaryTemp, discountTemp, totalTemp };
  };

  return (
    <div className="fixed-cart">
      <div className="box-block">
        <div className="d-flex justify-content-between">
          <span className="box-block-title">Địa chỉ nhận hàng</span>
          {userInformation.phone && userInformation.address ? (
            <></>
          ) : (
            <>
              <div
                style={{ display: "inline-block", cursor: "pointer" }}
                onClick={handleUpdateUserInfo}
              >
                Cập nhật
              </div>
            </>
          )}
        </div>
        <div className="user-address">
          <div className="show-phone-address">
            <span>{userInformation.username}</span>
            {userInformation.phone ? (
              <>
                <span>{userInformation.phone}</span>
              </>
            ) : (
              <>
                <input
                  name="phone"
                  placeholder="Nhập số điện thoại"
                  type="number"
                  value={phone}
                  onChange={(event) => {
                    setPhone(event.target.value);
                  }}
                />
              </>
            )}
          </div>
          <div className="show-address">
            {userInformation.address ? (
              <>
                <span>{userInformation.address}</span>
              </>
            ) : (
              <>
                <input
                  name="address"
                  placeholder="Nhập địa chỉ giao hàng"
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                  }}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <div className="box-block">
        <span className="box-block-title">Ưu đãi và giảm giá</span>
        <div className="user-address">
          <div className="show-phone-address">
            <button
              className="btn btn-primary"
              onClick={() => {
                setShow(true);
              }}
            >
              {isUsedVoucher ? "Đã áp dụng 1 voucher" : "Sử dụng mã giảm giá"}
            </button>

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
                onSubmit={() => { }}
                errors={[]}
              />
            )}
          </div>
          <div className="mt-2 ms-3 d-flex justify-content-between">
            <h5>
              Mart Xu <FaBitcoin color="yellow" />
            </h5>
            <button
              className={`custom-button ${checked ? "checked" : ""}`}
              onClick={handleToggle}
            >
              <span className="number">[-{point}đ]</span>
              <span className="checkmark">{checked ? "✔" : "✖"}</span>
            </button>
          </div>
        </div>
      </div>
      <div className="box-block">
        <span className="box-block-title">Tổng tiền</span>
        <div className="summary-item">
          Tạm tính: <span>{formatVND(temporary)}</span>
        </div>
        <div className="summary-item">
          Giảm giá sản phẩm: <span>-{formatVND(discount)}</span>
        </div>
        {checked && (
          <div className="summary-item">
            Đã dùng Mart Xu: <span>-{point} ₫</span>
          </div>
        )}
        <div className="summary-item">
          Tổng tiền: <span>{formatVND(total)} (Đã bao gồm VAT)</span>
        </div>
        <button
          className="btn btn-order"
          onClick={handleClick}
          style={{ background: "#FF199B", margin: 0, color: "white" }}
        >
          Tiếp tục
        </button>
      </div>
    </div>
  );
}
