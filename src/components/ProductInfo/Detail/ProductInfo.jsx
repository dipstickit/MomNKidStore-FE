// import React, { useContext, useState } from "react";
// import "./Productinfo.scss";
// import { FaFacebookSquare } from "react-icons/fa";
// import { FaInstagramSquare } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa";
// import { useParams } from "react-router-dom";
// import { CartContext } from "../../Cart/CartContext";
// import { formatVND } from "../../../utils/Format";

// export default function ProductInfo({ product }) {
//   const { handleAddToCart } = useContext(CartContext);
//   const { id } = useParams();
//   const [quantity, setQuantity] = useState(1);

//   console.log(id);

//   const handleIncrease = () => {
//     setQuantity((prevQuantity) => prevQuantity + 1);
//   };

//   const handleDecrease = () => {
//     setQuantity((prevQuantity) =>
//       prevQuantity > 1 ? prevQuantity - 1 : 1
//     );
//   };

//   console.log(quantity)
//   return (
//     <>
//       <div key={product.product_id} className="productInfo_container">
//         <div className="container">
//           <div className="row product-content">
//             <div className="col-md-6 info">
//               <div className="ptc">
//                 <img src={product.image_url} />
//                 <div className="other_detail">
//                   Share:&nbsp;
//                   <a
//                     style={{ width: "10%" }}
//                     href="https://www.facebook.com/"
//                     target="_blank"
//                   >
//                     <FaFacebookSquare />
//                   </a>
//                   &nbsp;&nbsp;
//                   <a href="https://www.instagram.com/" target="_blank">
//                     <FaInstagramSquare />
//                   </a>
//                   &nbsp;&nbsp;<span>||</span>&nbsp;&nbsp;
//                   <FaHeart color="red" /> &nbsp;&nbsp;Liked! &nbsp;{" "}
//                   <span>(100)</span>
//                 </div>
//               </div>
//             </div>

//             <div className="col-md-6 info">
//               <div className="milk_name">
//                 <h3>{product.product_name}</h3>
//               </div>
//               <div className="brand">
//                 Brand:&nbsp;&nbsp;&nbsp;&nbsp;
//                 <span style={{ color: "#DB7093" }}>{product.brand_name}</span>
//               </div>

//               <div className="name">
//                 Name Of Product:&nbsp;&nbsp;&nbsp;{product.product_name}
//               </div>

//               <div className="feed_rate">
//                 Rating: &nbsp;&nbsp;
//                 <span style={{ color: "red" }}>{product.age_range}</span>
//               </div>

//               <div className="feed_rate">
//                 Description: &nbsp;&nbsp;{product.description}
//               </div>

//               <div className="feed_rate">
//                 Stock: &nbsp;&nbsp;{product.stock}
//               </div>

//               <div className="price fs-2 fw-bold ">
//                 <span style={{ color: "red" }}>{formatVND(product.price)}</span>
//               </div>

//               <div className="quantity">
//                 Quantity:&nbsp;&nbsp;
//                 <button className="btn_quantity"
//                   onClick={handleDecrease}>-</button>&nbsp;&nbsp;&nbsp;
//                 {quantity}&nbsp;&nbsp;&nbsp;
//                 <button className="btn_quantity"
//                   onClick={handleIncrease}>+</button>
//               </div>

//               <div className="add_buy ">
//                 <span>
//                   <button
//                     className="btn_add"
//                     onClick={() => {
//                       handleAddToCart({ ...product, quantity });
//                     }}
//                   >
//                     Add To Cart
//                   </button>
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React, { useContext, useState } from "react";
import "./Productinfo.scss";
import { FaFacebookSquare } from "react-icons/fa";
import { FaInstagramSquare } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { CartContext } from "../../Cart/CartContext";
import { formatVND } from "../../../utils/Format";

export default function ProductInfo({ product }) {
  const { handleAddToCart } = useContext(CartContext);
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  return (
    <div key={product.productId} className="productInfo_container">
      <div className="container">
        <div className="row product-content">
          <div className="col-md-6 info">
            <div className="ptc">
              {product.images && product.images.length > 0 ? (
                <img
                  src={`data:image/png;base64,${product.images[0].imageProduct}`}
                  alt={product.productName}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/150"
                  alt="Placeholder"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
              <div className="other_detail">
                Share:&nbsp;
                <a
                  style={{ width: "10%" }}
                  href="https://www.facebook.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookSquare />
                </a>
                &nbsp;&nbsp;
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagramSquare />
                </a>
                &nbsp;&nbsp;<span>||</span>&nbsp;&nbsp;
                <FaHeart color="red" /> &nbsp;&nbsp;Liked! &nbsp;{" "}
                <span>(100)</span>
              </div>
            </div>
          </div>

          <div className="col-md-6 info">
            <div className="milk_name">
              <h3>{product.productName}</h3>
            </div>
            <div className="brand">
              Category:&nbsp;&nbsp;&nbsp;&nbsp;
              <span style={{ color: "#DB7093" }}>{product.brandName}</span>
            </div>

            <div className="name">
              Name Of Product:&nbsp;&nbsp;&nbsp;{product.productName}
            </div>

            

            <div className="feed_rate">
              Description: &nbsp;&nbsp;{product.productInfor}
            </div>

            <div className="feed_rate">
              Stock: &nbsp;&nbsp;{product.productQuantity}
            </div>

            <div className="price fs-2 fw-bold ">
              <span style={{ color: "red" }}>{formatVND(product.productPrice)}</span>
            </div>

            <div className="quantity">
              Quantity:&nbsp;&nbsp;
              <button className="btn_quantity" onClick={handleDecrease}>
                -
              </button>
              &nbsp;&nbsp;&nbsp;{quantity}&nbsp;&nbsp;&nbsp;
              <button className="btn_quantity" onClick={handleIncrease}>
                +
              </button>
            </div>

            <div className="add_buy ">
              <span>
                <button
                  className="btn_add"
                  onClick={() => {
                    handleAddToCart({ ...product, quantity });
                  }}
                >
                  Add To Cart
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
