import React from "react";
import ProductList from "./ProductList/ProductList";
import DiscountSection from "./DiscountSection/DiscountSection";
import PaymentOptions from "./PaymentOptions/PaymentOptions";
import CartSummary from "./CartSummary/CartSummary";
import "./OrderPayment.scss";
import HeaderPage from "../../utils/Header/Header";
import FooterPage from "../../utils/Footer/FooterPage";
import UserInformation from "./UserInformation/UserInformation";

export default function OrderPayment() {
  return (
    <div>
      <HeaderPage />
      <div className="container" style={{ marginTop: "80px" }}>
        <div className="row">
          <div
            className="col-md-8 pr-md-4 mt-4"
            style={{ padding: "0px 15px" }}
          >
            <ProductList />
          </div>
          <div
            className="col-md-4 pr-md-4 d-flex flex-column"
            style={{ padding: "0px 15px", gap: "10px" }}
          >
            {/* <DiscountSection /> */}
            <UserInformation />
            <PaymentOptions />
            <CartSummary />
          </div>
        </div>
      </div>
      <FooterPage />
    </div>
  );
}
