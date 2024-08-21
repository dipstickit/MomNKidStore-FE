import React from 'react';
import NavBarStaff from '../../components/Staff/NavBar/NavBarDeliverier';
import { Route, Routes } from 'react-router-dom';
import  ConfirmTransport  from '../Deliverier/DeliverierPage';
export default function DeliverierManagement() {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 col-sm-3">
          <NavBarStaff />
        </div>
        <div className="col-md-10 col-sm-9">
          <Routes>
            <Route path="manage_transport" element={<ConfirmTransport />} />
           
          </Routes>
        </div>
      </div>
    </div>
  );
}
