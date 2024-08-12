import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import "./OrderDetail.scss";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CartContext } from "../CartContext";
import { MainAPI } from "../../API";

export default function OrderDetail() {
  const [cartList, setCartList] = useState([]);
  const token = JSON.parse(localStorage.getItem("accessToken"));

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      axios
        .get(`${MainAPI}/Cart/${customerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCartList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  }, [token]);

  const updateCartQuantity = async (cartId, newQuantity) => {
    try {
      await axios.put(
        `${MainAPI}/Cart/update-quantity?CartId=${cartId}&Quantity=${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartList((prevCartList) =>
        prevCartList.map((item) =>
          item.cartId === cartId ? { ...item, cartQuantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleIncreaseQuantity = (cartItem) => {
    const newQuantity = cartItem.cartQuantity + 1;
    updateCartQuantity(cartItem.cartId, newQuantity);
  };

  const handleDecreaseQuantity = (cartItem) => {
    if (cartItem.cartQuantity > 1) {
      const newQuantity = cartItem.cartQuantity - 1;
      updateCartQuantity(cartItem.cartId, newQuantity);
    }
  };

  const handleDeleteCart = async (cartItem) => {
    try {
      await axios.delete(`${MainAPI}/Cart/${cartItem.cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCartList((prevCartList) =>
        prevCartList.filter((item) => item.cartId !== cartItem.cartId)
      );
    } catch (error) {
      console.error("Error deleting cart item:", error);
    }
  };

  return (
    <>
      {cartList.length === 0 ? (
        <div className="order-product-list d-flex flex-column justify-content-center align-items-center">
          <div>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Fcart-empty.png?alt=media&token=e796d2a1-62c9-4415-a878-c88499ed01e7"
              alt="cart"
            />
          </div>
          <div>
            <h5>Hiện chưa có sản phẩm nào trong giỏ hàng</h5>
          </div>
        </div>
      ) : (
        <div className="order-product-list">
          <div className="order-product-list-block">
            <div className="item-cart-product-line">
              <div className="item-cart-price">Đơn giá</div>
              <div className="item-cart-quantity">Số lượng</div>
              <div className="item-cart-total">Thành tiền</div>
              <div className="item-cart-actions">Actions</div>
            </div>
            {cartList.map((cartItem) => (
              <div key={cartItem.cartId} className="cart-product-line">
                <div className="block-cart-first">
                  <div className="product-img">
                    <img
                      src={
                        cartItem.productView.images.length > 0
                          ? cartItem.productView.images[0].imageProduct1
                          : "https://via.placeholder.com/150"
                      }
                      alt={cartItem.productView.productName}
                    />
                  </div>
                  <div className="item-cart-product-name">
                    {cartItem.productView.productName}
                  </div>
                </div>
                <div className="block-cart-end">
                  <div className="item-cart-quantity-pro">
                    <div className="btn-1">
                      <button onClick={() => handleDecreaseQuantity(cartItem)}>
                        -
                      </button>
                    </div>
                    {cartItem.cartQuantity}
                    <div className="btn-1">
                      <button onClick={() => handleIncreaseQuantity(cartItem)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-cart-total">
                    {(cartItem.productView.productPrice * cartItem.cartQuantity).toLocaleString(
                      "vi-VN",
                      {
                        style: "currency",
                        currency: "VND",
                      }
                    )}
                  </div>
                  <div className="item-cart-actions">
                    <div className="btn-delete">
                      <button
                        onClick={() => handleDeleteCart(cartItem)}
                        style={{ border: "none", background: "none" }}
                      >
                        <MdDelete />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

