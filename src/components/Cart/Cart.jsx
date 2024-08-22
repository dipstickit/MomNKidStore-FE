import React from 'react';
import { FaLongArrowAltLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { PriceProvider } from './PriceContext';
import OrderDetail from './OrderDetail/OrderDetail';
import OrderUserInfo from './OrderUserInfo/OrderUserInfo';
import FooterPage from '../../utils/Footer/FooterPage';
import HeaderPage from '../../utils/Header/Header';
import "./Cart.scss";

export default function Cart() {
  const nav = useNavigate();

  const handleClick = () => {
    nav("/home");
  };

  return (
    <PriceProvider>
      <div className="cart-container">
        <div className="cart-header">
          <HeaderPage />
        </div>
        <div className="title">
          <h1>Cart</h1>
          <button onClick={handleClick} className="button-62">
            <FaLongArrowAltLeft /> Continue shopping
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
    </PriceProvider>
  );
}
