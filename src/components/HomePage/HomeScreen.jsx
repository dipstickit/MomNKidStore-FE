import React from "react";
import HeaderPage from "../../utils/Header/Header";
import Advertise from "./Content/Advertisement/Advertise";
import FooterPage from "../../utils/Footer/FooterPage";
import Brand from "./Content/Brand/Brand";
import UseFull from "./Content/Useful/UseFull";
import FillterType from "./Content/Shopping/FillterType";
import Voucher from "./Content/Voucher/Voucher";

export default function HomeScreen() {
  return (
    <div style={{ backgroundColor: "#F5F7FD" }}>
      <HeaderPage />
      <div className="container">
        <Advertise />
        <Voucher />
        <Brand />
        <UseFull />
        <FillterType />
      </div>
      <FooterPage />
    </div>
  );
}
