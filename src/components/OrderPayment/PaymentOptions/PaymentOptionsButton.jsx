import React from "react";

const PaymentOptionsButton = ({
  selected,
  icon,
  title,
  description,
  onClick,
}) => {
  return (
    <div
      className={`payment-option-button ${selected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div className="icon">
        <img src={icon} alt={title} />
      </div>
      <div className="details">
        <div className="title">{title}</div>
        <div className="description">{description}</div>
      </div>
    </div>
  );
};

export default PaymentOptionsButton;
