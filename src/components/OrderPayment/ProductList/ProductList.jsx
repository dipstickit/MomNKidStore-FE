import React, { useContext } from "react";
import { ListOfProduct } from "../../Cart/ListOfProduct";
import { CartContext } from "../../Cart/CartContext";

const ProductList = () => {
  const { cartList } = useContext(CartContext);
  return (
    <div className="product-list">
      {cartList.map((product) => {
        return (
          <div className="product-item d-flex justify-content-between align-items-center">
            <div
              className="product-info d-flex align-items-center"
              style={{ maxWidth: "800px" }}
            >
              <img
                src={product.image_url}
                alt="Herbs of Gold Pregnancy Plus 1-2-3"
              />
              <div className="product-details">
                <div>{product.product_name}</div>
              </div>
            </div>
            <div className="d-flex justify-content-between align-items-center">
              <div className="product-quantity">x{product.quantity}</div>
              <div className="product-price text-end">{product.price}₫</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductList;
