import React, { useState } from "react";
import PaymentOptionsButton from "./PaymentOptionsButton";

const PaymentOptions = ({ setSelectedMethod }) => {
  const [selectedMethod, setSelectedMethodState] = useState("VNPAY");

  const handleMethodChange = (method) => {
    setSelectedMethodState(method);
    setSelectedMethod(method);
  };

  return (
    <div className="payment-options">
      <h5>Payment Methods</h5>
      <div className="payment-methods">
        <PaymentOptionsButton
          selected={selectedMethod === "VNPAY"}
          icon="https://res.cloudinary.com/dmyyf65yy/image/upload/v1723772161/vnpay-logo-vinadesign-25-12-57-55_xmlr0u.jpg"
          title="VNPAY Wallet Payment"
          description="VNPAY Wallet"
          onClick={() => handleMethodChange("VNPAY")}
        />
      </div>
    </div>
  );
};

export default PaymentOptions;
