import React, { useEffect, useState } from "react";
import "./Productinfo.scss";
import { FaFacebookSquare, FaInstagramSquare, FaHeart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { formatVND } from "../../../utils/Format";
import axios from "axios";
import { MainAPI } from "../../API";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function ProductInfo() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const nav = useNavigate();
  const token = JSON.parse(localStorage.getItem("accessToken"));

  useEffect(() => {
    axios
      .get(`${MainAPI}/Product/get-product-by-id/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [productId]);

  const handleIncrease = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrease = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  const handleAddToCart = async () => {
    if (!token) {
      toast.error("You need to login to add products to cart.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const customerId = decodedToken.customerId;

    if (product.productQuantity <= 0) {
      toast.error("Product is out of stock, please pre-order.");
      return;
    }
    try {
      const response = await axios.post(
        `${MainAPI}/Cart`,
        {
          productId: product.productId,
          customerId: customerId,
          cartQuantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200 || response.status === 201) {
        toast.success("Product has been added to cart!");
      } else {
        toast.error("An error occurred while adding the product to the cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding the product to the cart.");
    }
  };

  const handlePreOrder = () => {
    if (!token) {
      toast.error("You need to login to pre-order");
      return;
    }

    if (product) {
      if (product.productQuantity > 0) {
        toast.error("Product is in stock. No need to pre-order.");
        return;
      }
      nav(`/pre-order/${product.productId}`);
    }
  };


  if (loading) {
    return (
      <div className="text-center" style={{ marginTop: "120px" }}>
        <Spinner animation="border" role="status" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="productInfo_container">
      <div className="container">
        <div className="row product-content">
          <div className="col-md-6 info">
            <div className="ptc">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0].imageProduct1}
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
              <span style={{ color: "red" }}>
                {formatVND(product.productPrice)}
              </span>
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
                <button className="btn_add" onClick={handleAddToCart}>
                  Add To Cart
                </button>
              </span>
              <span>
                <button className="btn_pre_order" onClick={handlePreOrder}>
                  Pre-order
                </button>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
