import React, { useContext, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import "./Header.scss";
import axios from "axios";
import { MainAPI } from "../../components/API";
import AuthContext from "../../context/AuthProvider";
import useOrder from "../../hooks/useOrder";
import { MdLogin } from "react-icons/md";
import { RiLogoutBoxLine } from "react-icons/ri";
import { CartContext } from "../../components/Cart/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function HeaderPage() {
  const [searchValue, setSearchValue] = useState("");
  const { setAuth } = useContext(AuthContext);
  const { setOrderInfomation } = useOrder();
  const [searchParams, setSearchParams] = useSearchParams();
  const { cartList } = useContext(CartContext);

  const token = JSON.parse(localStorage.getItem("accessToken"));
  const nav = useNavigate();
  const myParam = searchParams.get("search_query");

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth');
    toast.success('Đăng xuất thành công');
    nav('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ search_query: searchValue });
    nav({
      pathname: "/search",
      search: `?search_query=${searchValue}`,
    });
  };

  return (
    <div className=" search-bar">
      <ToastContainer />
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div
            className="logo col-3"
            style={{ cursor: "pointer" }}
            onClick={() => {
              nav("/home");
            }}
          >
            <img src="https://res.cloudinary.com/dmyyf65yy/image/upload/v1722845760/fresh-milk-with-text-banner_1308-6819.jpg_nefazw.jpg" />
          </div>

          <div className="search col-6">
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm kiếm loại sữa phù hợp"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              <button type="submit" className="btn" name="submit-search">
                Tìm kiếm
              </button>
            </form>
          </div>

          <div className="other_header d-flex align-center justify-content-space col-3">
            {token ? (
              <>
                <Link to="/cart" className="acc">
                  <div className="acc_icon">
                    <button type="button" className="btn position-relative">
                      <FaShoppingCart />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        {cartList.length <= 10 ? cartList.length : 10 + "+"}
                      </span>
                    </button>
                  </div>
                  &nbsp;
                </Link>
                <Link to="/customer-account" className="acc">
                  <div className="acc_icon">
                    <FaUser />
                  </div>
                  <div className="detail">Tài khoản</div>
                </Link>{" "}
                <div className="acc" onClick={handleLogout}>
                  <div className="acc_icon">
                    <RiLogoutBoxLine />
                  </div>
                  <div className="detail">Đăng xuất</div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="acc"
                  onClick={() => {
                    nav("/login");
                  }}
                >
                  <div className="acc_icon">
                    <MdLogin />
                  </div>
                  <div className="detail">Đăng Nhập</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
