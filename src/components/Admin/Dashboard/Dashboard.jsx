import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import "./Dashboard.scss";
import Chart from "./Chart/Chart";
import { PiMoney } from "react-icons/pi";
import { BsBoxSeam, BsCart3 } from "react-icons/bs";
import DateRangeButton from "../../../utils/Button/DateRangeButton";
import { formatVND, formattedDate } from "../../../utils/Format";
import axios from "axios";
import { MainAPI } from "../../API";
import { set } from "date-fns";

export default function Dashboard() {
  // State variables for start and end dates
  const [startDate, setStartDate] = useState(new Date("2024-06-01"));
  const [endDate, setEndDate] = useState(new Date("2024-12-01"));
  const [data, setData] = useState({});

  const [cancelOrder, setCancelOrder] = useState(0);

  // Function to receive start and end dates from DateRangeButton
  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  console.log(formattedDate(startDate), formattedDate(endDate));

  const fetchData = async () => {
    const data = await axios
      .get(`${MainAPI}/admin/dashboard`, {
        params: {
          startDate: formattedDate(startDate),
          endDate: formattedDate(endDate),
        },
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setCancelOrder(res.data.canceledOrdersPerMonth);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  console.log(data);

  return (
    <>
      <div className="d-flex">
        <NavBar />
        <div className="dashboard_container">
          <div className="dashboard-content container">
            <div className="d-flex justify-content-between">
              <h1 className="mt-0">Dashboard</h1>
              <div>
                <DateRangeButton onDateChange={handleDateChange} />
              </div>
            </div>
            <div className="row justify-content-between">
              <div className="col col-md-4">
                <div className="card card-content m-0">
                  <div className="card-body col-10">
                    <div className="card-title fw-bold">Số đơn hàng đã hủy</div>
                    <div className="d-flex justify-content-between m-0">
                      <div>{cancelOrder}</div>
                      <div className="col-2 icon">
                        <BsBoxSeam />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col col-md-4">
                <div className="card card-content m-0">
                  <div className="card-body col-10">
                    <div className="card-title fw-bold">Tổng doanh thu</div>
                    <div className="d-flex justify-content-between m-0">
                      <div>{formatVND(data.totalRevenue)}</div>
                      <div className="col-2 icon">
                        <PiMoney />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col col-md-4">
                <div className="card card-content m-0">
                  <div className="card-body col-10">
                    <div className="card-title fw-bold">Tổng số đơn hàng</div>
                    <div className="d-flex justify-content-between m-0">
                      <div>{data.totalOrders}</div>
                      <div className="col-2 icon">
                        <BsCart3 />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Chart
              startDate={formattedDate(startDate)}
              endDate={formattedDate(endDate)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
