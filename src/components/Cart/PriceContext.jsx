import React, { createContext, useContext, useState } from 'react';

const PriceContext = createContext();

export const usePrice = () => useContext(PriceContext);

export const PriceProvider = ({ children }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    const [voucherID, setVoucherID] = useState(null);
    const [isExchangedPoint, setIsExchangedPoint] = useState(false);

    const updateTotalPrice = (newPrice) => {
        setTotalPrice(newPrice);
    };


    const updateVoucherID = (id) => {
        setVoucherID(id);
    };

    const updateIsExchangedPoint = (value) => {
        setIsExchangedPoint(value);
    };

    return (
        <PriceContext.Provider value={{
            totalPrice,
            updateTotalPrice,
            voucherID,
            updateVoucherID,
            isExchangedPoint,
            updateIsExchangedPoint
        }}>
            {children}
        </PriceContext.Provider>
    );
};
