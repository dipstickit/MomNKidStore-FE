import { createContext, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

function CartProvider({ children }) {
  const [cartList, setCartList] = useState([]);
  const token = JSON.parse(localStorage.getItem("accessToken"));

  const handleAddToCart = (product, quantity = 1) => {
    if (token) {
      const checkExist = cartList.findIndex(
        (item) => item.product_id === product.product_id
      );
      if (checkExist !== -1) {
        const newCartList = [...cartList];
        newCartList[checkExist].quantity += quantity;
        setCartList(newCartList);
      } else {
        setCartList([...cartList, product]);
      }
      toast.success("Thêm sản phẩm thành công", {
        position: "bottom-right",
      });
    } else {
      toast.error("Hãy đăng nhập để thêm sản phẩm vào giỏ hàng", {
        position: "bottom-right",
      });
    }
  };

  const handleDeleteCart = (product) => {
    const updatedCart = cartList.filter(
      (item) => item.product_id !== product.product_id
    );
    setCartList(updatedCart);
  };

  const incrementQuantity = (product) => {
    setCartList(
      cartList.map((item) =>
        item.product_id === product.product_id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementQuantity = (product) => {
    setCartList(
      cartList.map((item) =>
        item.product_id === product.product_id
          ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartList,
        handleAddToCart,
        handleDeleteCart,
        decrementQuantity,
        incrementQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export { CartContext, CartProvider };
