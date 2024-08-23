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
  LineController,
} from "chart.js";
import { Bar, Pie, Line } from "react-chartjs-2";
import axios from "axios";
import { MainAPI } from "../../../API";
import "./Chart.scss";
import { formatVND } from '../../../../utils/Format';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  LineController
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return formatVND(tooltipItem.raw);
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function (value) {
          return formatVND(value);
        }
      }
    }
  }
};

export default function Chart({ startDate, endDate }) {
  const [topProducts, setTopProducts] = useState([]);
  const [monthSales, setMonthSales] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    axios
      .get(`${MainAPI}/admin/dashboard`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })
      .then((res) => {
        setTopProducts(res.data.topSellingProducts || []);
        setMonthSales(res.data.monthSales || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [startDate, endDate]);


  const dataLineChart = {
    labels: monthSales.length > 0 ? monthSales.map((sale) => `Tháng ${sale.month}`) : [],
    datasets: [
      {
        label: "Monthly Revenue",
        data: monthSales.length > 0 ? monthSales.map((sale) => sale.totalSales) : [],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const dataPieChart = {
    labels: topProducts.length > 0 ? topProducts.map((product) => product.productName) : [],
    datasets: [
      {
        label: "Number of units sold",
        data: topProducts.length > 0 ? topProducts.map((product) => product.productQuantity) : [],
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
          <p className="fw-bold m-0">Total revenue by month </p>
          <div className="chart">
            <Line options={options} data={dataLineChart} />
          </div>
        </div>
        <div className="chart-col-pie col-md-4">
          <p className="fw-bold m-0">Top products sold</p>
          <div className="chart">
            <Pie data={dataPieChart} />
          </div>
        </div>
      </div>
    </>
  );
}
