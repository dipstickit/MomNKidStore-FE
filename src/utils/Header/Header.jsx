import React, { useContext, useEffect, useState } from "react";
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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { jwtDecode } from "jwt-decode";

export default function HeaderPage() {
  const [searchValue, setSearchValue] = useState("");
  const [username, setUsername] = useState("");
  const { setAuth } = useContext(AuthContext);
  const { setOrderInfomation } = useOrder();
  const [searchParams, setSearchParams] = useSearchParams();
  // const { cartList } = useContext(CartContext);
  const [suggestions, setSuggestions] = useState([]);

  const token = JSON.parse(localStorage.getItem("accessToken"));
  const nav = useNavigate();
  const myParam = searchParams.get("search_query");

  useEffect(() => {
    const script = document.createElement('script');
    script.src = "//js-na1.hs-scripts.com/47077339.js";
    script.async = true;
    script.defer = true;
    script.id = "hs-script-loader";
    document.body.appendChild(script);

    return () => {
      // Cleanup the script when the component unmounts
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      const customerId = decodedToken.customerId;

      axios.get(`${MainAPI}/Customer/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setUsername(response.data.userName);
        })
        .catch(error => {
          console.error("Error fetching customer data:", error);
        });
    }
  }, [token]);

  const fetchSuggestions = async (query) => {
    try {
      const response = await axios.get(`${MainAPI}/Product/search-product/${query}`);
      setSuggestions(response.data);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth');
    toast.success('Logout successfully');
    nav('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    nav({
      pathname: "/search",
      search: `?search_query=${searchValue}`,
    });

    setSuggestions([]);
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (item) => {
    setSearchValue(item.name);
    setSuggestions([]);
    nav(`/product/${item.id}`);
  };

  return (
    <div className="search-bar">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div
            className="logo col-3"
            style={{ cursor: "pointer" }}
            onClick={() => {
              nav("/home");
            }}
          >
            <img src="https://res.cloudinary.com/dmyyf65yy/image/upload/v1724468496/_4ca70df4-207a-4540-aadb-571ec2efff4b_wpm48c.jpg" />
          </div>

          <div className="search col-6">
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Find the right milk"
                value={searchValue}
                onChange={handleSearchInputChange}
              />
              <button type="submit" className="btn" name="submit-search">
                Find
              </button>
            </form>

            {suggestions.length > 0 && (
              <div className="suggestions">
                <ul>
                  {suggestions.map((item) => (
                    <li key={item.id} onClick={() => handleSuggestionClick(item)}>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="other_header d-flex align-center justify-content-space col-3">
            {token ? (
              <>
                <Link to="/cart" className="acc">
                  <div className="acc_icon">
                    <button type="button" className="btn position-relative">
                      <FaShoppingCart />
                      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                        Cart
                      </span>
                    </button>
                  </div>
                  &nbsp;
                </Link>
                <Link to="/customer-account" className="acc">
                  <div className="acc_icon">
                    <FaUser />
                  </div>
                  <div className="detail">{username}</div>
                </Link>
                <div className="acc" onClick={handleLogout}>
                  <div className="acc_icon">
                    <RiLogoutBoxLine />
                  </div>
                  <div className="detail">Logout</div>
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
                  <div className="detail">Login</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
