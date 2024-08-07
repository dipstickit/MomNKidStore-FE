import React from 'react';
import NavBarStaff from '../NavBar/NavBarStaff';
import { Route, Routes } from 'react-router-dom';
import ConfirmOrder from '../ConfirmOrder/ConfirmOrder';
import ManageVoucher from '../CreateVoucher/ManageVoucher';
import ProductManagement from '../ProductManagement/ProductManagement';
import TrackOrder from '../TrackOrder/TrackOrder';
import ManagePosts from '../ManagePosts/ManagePosts';
import Report from '../Report/Report';
import ManageUser from '../ManageUser/ManageUser';
import ManageCategory from '../ManageCategory/ManageCategory';
export default function StaffManagement() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 col-sm-3">
          <NavBarStaff />
        </div>
        <div className="col-md-10 col-sm-9">
          <Routes>
            <Route path="comfirm_order" element={<ConfirmOrder />} />
            <Route path="manage_product" element={<ProductManagement />} />
            <Route path="manage_pcategory" element={<ManageCategory />} />
            <Route path="manage_users" element={<ManageUser />} />
            <Route path="create_voucher_codes" element={<ManageVoucher />} />
            <Route path="track_orders" element={<TrackOrder />} />
            <Route path="manage_posts" element={<ManagePosts />} />
            <Route path="report" element={<Report />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
