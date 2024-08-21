// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Spinner } from "react-bootstrap";
// import { useParams } from "react-router-dom";
// import { formatVND, formattedDate } from "../../../utils/Format";
// import HeaderPage from "../../../utils/Header/Header";
// import FooterPage from "../../../utils/Footer/FooterPage";
// import { MainAPI } from "../../API";
// import "./OrderDetail.scss";

// const OrderDetail = () => {
//   const { orderId } = useParams(); // Get the orderId from the URL
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrderDetail = async () => {
//       try {
//         const token = JSON.parse(localStorage.getItem("accessToken"));

//         const response = await axios.get(`${MainAPI}/Order/detail/${orderId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         setOrder(response.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching order details:", error);
//         setLoading(false);
//       }
//     };

//     fetchOrderDetail();
//   }, [orderId]);

//   if (loading) {
//     return (
//       <div className="text-center" style={{ marginTop: "120px" }}>
//         <Spinner animation="border" role="status" />
//       </div>
//     );
//   }

//   if (!order) {
//     return <div>No order details found</div>;
//   }

//   return (
//     <div className="container-page">

// <HeaderPage />

//     <div className="order-detail-wrapper">
//       <div className="container">
//         <h2>Thông tin đơn hàng</h2>
//         <div className="order-info">
//           <p>Mã đơn hàng: {order.orderId}</p>
//           <p>Ngày: {formattedDate(new Date(order.orderDate))}</p>
//           <p>Tổng tiền: {formatVND(order.totalPrice)}</p>
//           <p>Trạng thái: {getOrderStatusText(order.status)}</p>
//         </div>

//         <h2>Sản phẩm đơn hàng</h2>
//         <div className="order-items">
//           {order.orderDetails.map((detail, index) => (
//             <div key={index} className="order-item">
//               <img
//                 src={
//                   detail.product.images && detail.product.images.length > 0
//                     ? detail.product.images[0].imageProduct1
//                     : "https://via.placeholder.com/150x100"
//                 }
//                 alt={detail.product.productName}
//                 className="product-image"
//               />
//               <div className="product-details">
//                 <p>Tên sản phẩm: {detail.product.productName}</p>
//                 <p>Số lượng đặt hàng: {detail.orderQuantity}</p>
//                 <p>Giá: {formatVND(detail.productPrice)}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//     <FooterPage />

//     </div>
//   );
// };

// const getOrderStatusText = (status) => {
//   switch (status) {
//     case 0:
//       return "Đang chờ";
//     case 1:
//       return "Đã thanh toán";
//     case 2:
//       return "Đã hủy";
//     case 3:
//       return "Đang vận chuyển";
//     case 4:
//       return "Giao hàng thành công";
//     case 5:
//       return "Hoàn tiền";
//     default:
//       return "Unknown";
//   }
// };

// export default OrderDetail;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { formatVND, formattedDate } from "../../../utils/Format";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import { MainAPI } from "../../API";
import "./OrderDetail.scss";

const OrderDetail = () => {
  const { orderId } = useParams(); // Get the orderId from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("accessToken"));

        const response = await axios.get(`${MainAPI}/Order/detail/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOrder(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "120px" }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!order) {
    return <div>No order details found</div>;
  }

  return (
    <div className="container-page">
      <HeaderPage />

      <div className="order-detail-wrapper">
        <div className="container">
          <h2>Thông tin đơn hàng</h2>
          <table className="order-info">
            <tbody>
              <tr>
                <td>Mã đơn hàng:</td>
                <td>{order.orderId}</td>
              </tr>
              <tr>
                <td>Ngày:</td>
                <td>{formattedDate(new Date(order.orderDate))}</td>
              </tr>
              <tr>
                <td>Tổng tiền:</td>
                <td>{formatVND(order.totalPrice)}</td>
              </tr>
              <tr>
                <td>Trạng thái:</td>
                <td>{getOrderStatusText(order.status)}</td>
              </tr>
            </tbody>
          </table>

          <h2>Sản phẩm đơn hàng</h2>
          <table className="order-items">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {order.orderDetails.map((detail, index) => (
                <tr key={index}>
                  <td>
                    <img
                      src={
                        detail.product.images && detail.product.images.length > 0
                          ? detail.product.images[0].imageProduct1
                          : "https://via.placeholder.com/150x100"
                      }
                      alt={detail.product.productName}
                      className="product-image"
                    />
                  </td>
                  <td>{detail.product.productName}</td>
                  <td>{detail.orderQuantity}</td>
                  <td>{formatVND(detail.productPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <FooterPage />
    </div>
  );
};

const getOrderStatusText = (status) => {
  switch (status) {
    case 0:
      return "Đang chờ";
    case 1:
      return "Đã thanh toán";
    case 2:
      return "Đã hủy";
    case 3:
      return "Đang vận chuyển";
    case 4:
      return "Giao hàng thành công";
    case 5:
      return "Hoàn tiền";

    case 10:
      return "Đơn đặt trước"
    case 11:
      return "Đặt trước thành công"
    case 12:
      return "Hủy đặt trước"

    case 20:
      return "Đang xử lý đơn đổi trả";
    case 21:
      return "Đổi trả thành công";
    default:
      return "Unknown";
  }
};

export default OrderDetail;

