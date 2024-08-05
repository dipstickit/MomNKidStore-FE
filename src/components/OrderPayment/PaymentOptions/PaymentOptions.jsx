import React, { useState } from "react";
import PaymentOptionsButton from "./PaymentOptionsButton";
import { SiZalo } from "react-icons/si";

const PaymentOptions = () => {
  const [selectedMethod, setSelectedMethod] = useState("ZaloPay");

  return (
    <div className="payment-options">
      <h5>Phương Thức Thanh Toán</h5>
      <div className="payment-methods">
        <PaymentOptionsButton
          selected={selectedMethod === "ZaloPay"}
          icon="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2FLogo-ZaloPay-Square.png?alt=media&token=82235a2a-503a-48f7-af08-1e038bf76ad3"
          title="Thanh toán ví ZaloPay"
          description="Ví ZaloPay"
          onClick={() => setSelectedMethod("ZaloPay")}
        />
      </div>
    </div>
  );
};

export default PaymentOptions;
