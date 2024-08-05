import React from "react";
import "./Sidebar.scss";

export default function Sidebar() {
  return (
    <div className="sidebar col-3">
      <div className="parent-info d-flex">
        <div className="avatar"></div>
        <div className="ms-2">
          <small>Bố mẹ</small>
          <small className="d-block">Thông tin tài khoản</small>
        </div>
      </div>
      <div className="box-block"></div>
      <div>
        <div className="mb-5">Thẻ thành viên</div>
        <div>Tiền tích lũy</div>
      </div>
    </div>
  );
}
