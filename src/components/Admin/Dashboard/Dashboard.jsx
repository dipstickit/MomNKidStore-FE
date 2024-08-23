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
  const [data, setData] = useState({});
  const [cancelOrder, setCancelOrder] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalSoldProduct, setTotalSoldProduct] = useState(null);

  const token = JSON.parse(localStorage.getItem("accessToken"));
  useEffect(() => {
    const fetchTotalSoldProduct = async () => {
      try {
        const monthYear = `${selectedDate.getMonth() + 1}/${selectedDate.getFullYear()}`;
        const response = await axios.get(`${MainAPI}/Admin/totalSoldProduct`, {
          params: {
            filter: monthYear,
          },
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        if (response.data) {
          setTotalSoldProduct(response.data);
        } else {
          setTotalSoldProduct("Tháng này hiện không có sản phẩm.");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch the total sold products.");
        setTotalSoldProduct(null);
      }
    };

    fetchTotalSoldProduct();
  }, [selectedDate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${MainAPI}/Admin/dashboard`, {
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
  }, []);
  const handleDateChange = (date) => {
    setSelectedDate(date);
  };
  return (
    <div className="d-flex">
      <NavBar />
      <div className="dashboard_container">
        <div className="dashboard-content container">
          <h1 className="mt-0">Dashboard</h1>
          <label>Date Filter by product sold</label>
          <div className="d-flex justify-content-between align-items-center">
            <div className="date-picker-container">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="MM-yyyy"
                placeholderText="Order date"
                showMonthYearPicker
              />
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
                      <div className="card-title fw-bold">Number of products sold</div>
                      <div className="d-flex justify-content-between m-0">
                        <div>{totalSoldProduct}</div>
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
                      <div className="card-title fw-bold">Total revenue</div>
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
                      <div className="card-title fw-bold">TotalOrder</div>
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
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
