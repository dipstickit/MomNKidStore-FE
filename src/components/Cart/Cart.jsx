import { FaLongArrowAltLeft } from "react-icons/fa";
import "./Cart.scss";
import { useNavigate } from "react-router-dom";
import OrderDetail from "./OrderDetail/OrderDetail";
import OrderUserInfo from "./OrderUserInfo/OrderUserInfo";
import FooterPage from "../../utils/Footer/FooterPage";
import HeaderPage from "../../utils/Header/Header";

export default function Cart() {
  const nav = useNavigate();

  const handleClick = () => {
    nav("/home");
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <HeaderPage />
      </div>
      <div className="title">
        <h1>Giỏ hàng</h1>
        <button onClick={handleClick} className="button-62">
          <FaLongArrowAltLeft /> Tiếp tục mua hàng
        </button>
      </div>
      <div className="order-information">
        <div className="order-details">
          <OrderDetail />
        </div>
        <div className="order-user-info">
          <OrderUserInfo />
        </div>
      </div>
      <FooterPage />
    </div>
  );
}
