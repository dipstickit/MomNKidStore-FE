import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { usePrice } from '../PriceContext';
import { jwtDecode } from 'jwt-decode';
import { MainAPI } from '../../API';
import './OrderDetail.scss';
import { MdDelete } from "react-icons/md";

export default function OrderDetail() {
  const {
    totalPrice,
    updateTotalPrice,
    voucherID,
    updateVoucherID,
    updateIsExchangedPoint
  } = usePrice();
  const [cartList, setCartList] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isExchangedPoint, setIsExchangedPoint] = useState(false);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);
  const token = JSON.parse(localStorage.getItem("accessToken"));

  const fetchCartData = () => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      axios
        .get(`${MainAPI}/Cart`, {
          params: {
            CustomerId: customerId,
            VoucherId: selectedVoucherId,
            IsExchangedPoint: isExchangedPoint
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setCartList(response.data.cartItems);
          updateTotalPrice(response.data.totalPrice);
          updateVoucherID(selectedVoucherId);
        })
        .catch((error) => {
          console.error("Error fetching cart data:", error);
        });
    }
  };

  useEffect(() => {
    fetchCartData();

    axios
      .get(`${MainAPI}/VoucherOfShop`)
      .then((response) => {
        setVouchers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching vouchers:", error);
      });
  }, [token, selectedVoucherId, isExchangedPoint]);

  const handleVoucherChange = (event) => {
    const selectedId = Number(event.target.value);
    setSelectedVoucherId(selectedId);
    updateVoucherID(selectedId);

    const voucher = vouchers.find(voucher => voucher.voucherId === selectedId);
    setSelectedVoucher(voucher || null);
  };

  const handlePointChange = () => {
    setIsExchangedPoint((prev) => !prev);
    updateIsExchangedPoint(!isExchangedPoint);
  };

  const handleIncreaseQuantity = async (cartItem) => {
    const newQuantity = cartItem.cartQuantity + 1;
    try {
      await axios.put(
        `${MainAPI}/Cart/update-quantity?CartId=${cartItem.cartId}&Quantity=${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCartData();
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const handleDecreaseQuantity = async (cartItem) => {
    if (cartItem.cartQuantity > 1) {
      const newQuantity = cartItem.cartQuantity - 1;
      try {
        await axios.put(
          `${MainAPI}/Cart/update-quantity?CartId=${cartItem.cartId}&Quantity=${newQuantity}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchCartData();
      } catch (error) {
        console.error("Error updating cart quantity:", error);
      }
    }
  };

  const handleDeleteCart = async (cartItem) => {
    try {
      await axios.delete(`${MainAPI}/Cart/${cartItem.cartId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCartData();
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
          <div className="order-summary">
            <div className="order-summary-total">
              <span>Tổng đơn hàng:</span>{" "}
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </div>
            <div className="order-summary-vouchers">
              <span>Danh sách voucher:</span>
              <select onChange={handleVoucherChange} value={selectedVoucherId || ""}>
                <option value="">Chọn mã giảm giá</option>
                {vouchers.map((voucher) => (
                  <option key={voucher.voucherId} value={voucher.voucherId}>
                    Mã giảm giá {voucher.voucherValue}% (Áp dụng từ{" "}
                    {voucher.startDate} đến {voucher.endDate})
                  </option>
                ))}
              </select>
            </div>
            <div className="order-summary-points">
              <label>
                <input
                  type="checkbox"
                  checked={isExchangedPoint}
                  onChange={handlePointChange}
                />
                Sử dụng điểm thưởng
              </label>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
