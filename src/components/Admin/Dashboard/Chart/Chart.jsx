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
import { faker } from "@faker-js/faker";
import "./Chart.scss";
import axios from "axios";
import { MainAPI } from "../../../API";

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

  // console.log(barChartData);
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
        // console.log(res.data);
        setDataChart(res.data);
        setTopProducts(res.data.topProducts);
        setTotalRevenuePerPeriod(res.data.totalRevenuePerPeriod);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [startDate, endDate]);

  console.log(dataChart);
  const dataBarChart = {
    labels: barChartLabels,
    datasets: [
      {
        label: "Doanh thu theo tháng",
        data: barChartLabels.map((__, index) => barChartData[index]),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
    ],
  };

  const dataPieChart = {
    labels: topProducts.map((product) => product.brand_name),
    datasets: [
      {
        label: "Số lượng đã bán",
        data: topProducts.map((product) => product.totalSold),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
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
