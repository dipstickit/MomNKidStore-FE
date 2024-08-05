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

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState({});

  useEffect(() => {
    axios
      .get(`${MainAPI}/product/getProById/${id}`)
      .then((res) => {
        console.log(res.data);
        setProduct(res.data);
      })
      .catch((err) => console.log(err));
  }, []);


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
