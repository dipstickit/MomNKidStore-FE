import React, { useState, useEffect } from "react";
import NavBar from "../NavBar/NavBar";
import "./Dashboard.scss";
import Chart from "./Chart/Chart";
import { PiMoney } from "react-icons/pi";
import { BsBoxSeam, BsCart3 } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatVND, formattedDate } from "../../../utils/Format";
import axios from "axios";
import { MainAPI } from "../../API";

export default function Dashboard() {
  const [startDate, setStartDate] = useState(new Date("2024-08-03"));
  const [endDate, setEndDate] = useState(new Date("2024-08-22"));
  const [data, setData] = useState({});
  const [cancelOrder, setCancelOrder] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);

  const handleStartDateChange = (date) => {
    setStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const token = JSON.parse(localStorage.getItem("accessToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${MainAPI}/Admin/dashboard`, {
          params: {
            startDate: formattedDate(startDate),
            endDate: formattedDate(endDate),
          },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        setCancelOrder(response.data.canceledOrdersPerMonth);
        setTotalOrders(response.data.totalOrders);
        setData(response.data);

      } catch (err) {
        console.error(err);
        setError("Failed to fetch data from the dashboard API.");
      }
    };

    fetchData();
  }, [startDate, endDate]);

  return (
    <div className="d-flex">
      <NavBar />
      <div className="dashboard_container">
        <div className="dashboard-content container">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mt-0">Dashboard</h1>
            <div className="date-picker-container">
              {/* <DatePicker
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
              />
              <DatePicker
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                dateFormat="dd/MM/yyyy"
                className="date-picker"
              /> */}
            </div>
          </div>
          {error ? (
            <div>{error}</div>
          ) : (
            <>
              <div className="row justify-content-between">
                <div className="col col-md-4">
                  <div className="card card-content m-0">
                    <div className="card-body col-10">
                      <div className="card-title fw-bold">Số sản phẩm đã bán</div>
                      <div className="d-flex justify-content-between m-0">
                        <div>{data.totalSoldProduct}</div>
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
                        <div>{data.totalOrder}</div>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
