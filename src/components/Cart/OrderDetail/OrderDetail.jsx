import React, { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import "./OrderDetail.scss";
import { CartContext } from "../CartContext";

export default function OrderDetail() {
  const {
    cartList,
    handleDeleteCart,
    decrementQuantity,
    incrementQuantity,
  } = useContext(CartContext);

  console.log(cartList)

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
            </div>
            {cartList.map((product) => (
              <div key={product.product_id} className="cart-product-line">
                <div className="block-cart-first">
                  <div className="product-img">
                    <img src={product.image_url} alt={product.name} />
                  </div>
                  <div className="item-cart-product-name">
                    {product.product_name}
                  </div>
                </div>
                <div className="block-cart-end">
                  <div className="item-cart-price-pro mr-0 ">
                    {product.price}{" "}
                  </div>
                  <div className="item-cart-quantity-pro">
                    <div className="btn-1">
                      <button onClick={() => decrementQuantity(product)}>
                        -
                      </button>
                    </div>
                    {product.quantity}
                    <div className="btn-1">
                      <button onClick={() => incrementQuantity(product)}>
                        +
                      </button>
                    </div>
                  </div>
                  <div className="item-cart-total">
                    {product.price * product.quantity}
                  </div>
                  <div className="btn-delete">
                    <button
                      onClick={() => handleDeleteCart(product)}
                      style={{ border: "none", background: "none" }}
                    >
                      <MdDelete />
                    </button>
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
