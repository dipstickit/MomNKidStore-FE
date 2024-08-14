import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductInfo from "./Detail/ProductInfo";
import InfoDetail from "./DetailOfProduct/InfoDetail";
import HeaderPage from "../../utils/Header/Header";
import FooterPage from "../../utils/Footer/FooterPage";
import axios from "axios";
import { MainAPI } from "../API";
import Review from "./Reviews/Review";
import useScrollToTop from "../../hooks/ScrollToTop";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState({});


  useScrollToTop();

  return (
    <div>
      <HeaderPage />
      {product && <ProductInfo product={product} />}
      {product && <InfoDetail product={product} />}
      <Review />
      <FooterPage />
    </div>
  );
}
