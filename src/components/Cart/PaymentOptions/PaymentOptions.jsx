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
      <h5>Phương Thức Thanh Toán</h5>
      <div className="payment-methods">
        <PaymentOptionsButton
          selected={selectedMethod === "VNPAY"}
          icon="https://res.cloudinary.com/dmyyf65yy/image/upload/v1723772161/vnpay-logo-vinadesign-25-12-57-55_xmlr0u.jpg"
          title="Thanh toán ví VNPAY"
          description="Ví VNPAY"
          onClick={() => handleMethodChange("VNPAY")}
        />
      </div>
    </div>
  );
};

export default PaymentOptions;
