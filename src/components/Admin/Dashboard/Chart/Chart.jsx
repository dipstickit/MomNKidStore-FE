import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import { MainAPI } from "../../../API";
import "./Chart.scss";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

export default function Chart({ startDate, endDate }) {
  const [dataChart, setDataChart] = useState({});
  const [topProducts, setTopProducts] = useState([]);
  const [totalRevenuePerPeriod, setTotalRevenuePerPeriod] = useState([]);

  const barChartLabels = totalRevenuePerPeriod.map(
    (revenue) => revenue.periodMonth
  );
  const barChartData = totalRevenuePerPeriod.map(
    (revenue) => revenue.totalRevenue
  );

  useEffect(() => {
    axios
      .get(`${MainAPI}/admin/dashboard`, {
        params: {
          startDate: startDate,
          endDate: endDate,
        },
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        setDataChart(res.data);
        setTopProducts(res.data.topProducts || []);
        setTotalRevenuePerPeriod(res.data.totalRevenuePerPeriod || []);
      })
      .catch((err) => {
        console.log(err);

        // Fallback to dummy data
        setTopProducts([
          { brand_name: "Product A", totalSold: 150 },
          { brand_name: "Product B", totalSold: 120 },
          { brand_name: "Product C", totalSold: 90 },
          { brand_name: "Product D", totalSold: 70 },
          { brand_name: "Product E", totalSold: 60 },
        ]);

        setTotalRevenuePerPeriod([
          { periodMonth: "Jan", totalRevenue: 10000 },
          { periodMonth: "Feb", totalRevenue: 15000 },
          { periodMonth: "Mar", totalRevenue: 20000 },
          { periodMonth: "Apr", totalRevenue: 25000 },
          { periodMonth: "May", totalRevenue: 30000 },
        ]);
      });
  }, [startDate, endDate]);

  const dataBarChart = {
    labels: barChartLabels.length > 0 ? barChartLabels : ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: barChartData.length > 0 ? barChartData : [10000, 15000, 20000, 25000, 30000],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const dataPieChart = {
    labels: topProducts.length > 0 ? topProducts.map((product) => product.brand_name) : ["Product A", "Product B", "Product C", "Product D", "Product E"],
    datasets: [
      {
        label: "Số lượng đã bán",
        data: topProducts.length > 0 ? topProducts.map((product) => product.totalSold) : [150, 120, 90, 70, 60],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <>
      <div className="row-chart">
        <div className="chart-col-vertical col-md-8">
          <p className="fw-bold m-0">Tổng doanh thu</p>
          <div className="chart">
            <Bar options={options} data={dataBarChart} />
          </div>
        </div>
        <div className="chart-col-pie col-md-4">
          <p className="fw-bold m-0">Top sản phẩm đã bán</p>
          <div className="chart">
            <Pie data={dataPieChart} />
          </div>
        </div>
      </div>
    </>
  );
}
