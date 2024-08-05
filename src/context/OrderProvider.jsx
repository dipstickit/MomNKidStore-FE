import { createContext, useState } from "react";

const OrderContext = createContext({});

export const OrderProvider = ({ children }) => {
  const [orderInfomation, setOrderInfomation] = useState({});

  return (
    <OrderContext.Provider value={{ orderInfomation, setOrderInfomation }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContext;
