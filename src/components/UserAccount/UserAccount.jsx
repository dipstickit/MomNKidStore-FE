import React, { useState } from "react";
import "./UserAccount.scss";
import HeaderPage from "../../utils/Header/Header";
import FooterPage from "../../utils/Footer/FooterPage";
import Sidebar from "./Sidebar/Sidebar";
import CustomerDaGiao from "./Sidebar/ScreenCustomerAccount/DaGiao/CustomerDaGiao";
import CustomerChoGiao from "./Sidebar/ScreenCustomerAccount/ChoGiao/CustomerChoGiao";
import CustomerThanhToan from "./Sidebar/ScreenCustomerAccount/ThanhhToan/CustomerThanhToan";
import CustomerDangGiao from "./Sidebar/ScreenCustomerAccount/DangGiao/CustomerDangGiao";
import CustomerDaHuy from "./Sidebar/ScreenCustomerAccount/DaHuy/CustomerDaHuy";
import ChoThanhToan from "./Sidebar/ScreenCustomerAccount/ChoThanhToan/ChoThanhToan";

export default function UserAccount() {
  const [title, setTitle] = useState("Đã giao");
  return (
    <div style={{ " backgroundColor": "#f5f7fd" }}>
      <HeaderPage />
      <div className="container useraccount-container">
        <div className="d-flex justify-content-around">
          <Sidebar />
          <div className="account-info col-9">
            <div className="order-list-btn">
              <ul
                className="nav d-flex justify-content-between"
                style={{ cursor: "pointer" }}
              >
                <li
                  className="nav-item"
                  onClick={() => {
                    setTitle("Chờ thanh toán");
                  }}
                >
                  Chờ Thanh toán
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setTitle("Thanh toán");
                  }}
                >
                  Thanh toán
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setTitle("Chờ giao");
                  }}
                >
                  Chờ giao
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setTitle("Đang giao");
                  }}
                >
                  Đang giao
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setTitle("Đã giao");
                  }}
                >
                  Đã giao
                </li>
                <li
                  className="nav-item"
                  onClick={() => {
                    setTitle("Đã hủy");
                  }}
                >
                  Đã hủy
                </li>
              </ul>
            </div>

            <div className="status-content">
              <ChoThanhToan title={title} />

              <CustomerThanhToan title={title} />

              <CustomerChoGiao title={title} />

              <CustomerDangGiao title={title} />

              <CustomerDaGiao title={title} />

              <CustomerDaHuy title={title} />
            </div>
          </div>
        </div>
      </div>

      <FooterPage />
    </div>
  );
}
