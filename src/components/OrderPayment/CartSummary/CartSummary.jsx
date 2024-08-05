import React, { useContext, useEffect, useState } from "react";
import { ListOfProduct } from "../../Cart/ListOfProduct";
import useOrder from "../../../hooks/useOrder";
import axios from "axios";
import { MainAPI } from "../../API";
import { useNavigate } from "react-router-dom";
import { formatVND } from "../../../utils/Format";
import { CartContext } from "../../Cart/CartContext";
import { Button, Modal } from "react-bootstrap";

const CartSummary = () => {
  const { orderInfomation } = useOrder();
  const { cartList } = useContext(CartContext);
  const [temporary, setTemporary] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const total_amount = localStorage.getItem("total_amount");
  const hasPreorder = localStorage.getItem("preOrder");

  let isPreOrder = hasPreorder === "true";

  console.log(isPreOrder);

  const handleCalculate = () => {
    const temporaryTemp = cartList.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);

    let discountTemp = orderInfomation.discount * temporaryTemp;
    if (isNaN(discountTemp)) {
      discountTemp = 0;
    }

    const totalTemp = temporaryTemp - discountTemp;

    return { temporaryTemp, discountTemp, totalTemp };
  };

  useEffect(() => {
    const { temporaryTemp, discountTemp, totalTemp } = handleCalculate();

    setTemporary(temporaryTemp);
    setDiscount(discountTemp);
    setTotal(totalTemp);
  }, [cartList, orderInfomation.discount]);

  const handleOrder = () => {
    axios
      .post(
        `${MainAPI}/payment/zalopay`,
        { order_id: orderInfomation.order_id },
        {
          headers: {
            "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        window.location.href = res.data.order_url;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="cart-summary">
      <div className="summary-item">
        Tạm tính: <span>{formatVND(temporary)}</span>
      </div>
      <div className="summary-item">
        Giảm giá sản phẩm: <span>-{formatVND(discount)}</span>
      </div>
      <div className="summary-item">
        Phí vận chuyển: <span>+0 ₫</span>
      </div>
      <div className="summary-item">
        Tổng tiền: <span>{formatVND(total_amount)} (Đã bao gồm VAT)</span>
      </div>
      <button
        className="btn"
        style={{ background: "#FF199B", margin: 0, color: "white" }}
        onClick={isPreOrder ? handleShow : handleOrder}
      >
        Đặt Hàng
      </button>

      <div className="modal-content">
        <Modal show={show} onHide={handleClose} animation={false}>
          <Modal.Header closeButton>
            <Modal.Title>Confirm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Đơn hàng của bạn có sản phẩm không đủ số lượng? Bạn có muốn đặt
            trước không?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                handleClose();
                localStorage.removeItem("post_id");
              }}
            >
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                handleClose();
                handleOrder();
              }}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default CartSummary;
