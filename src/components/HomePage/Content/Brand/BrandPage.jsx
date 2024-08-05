import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductListShow from "../../ProductListShow";
import axios from "axios";
import { MainAPI } from "../../../API";
import HeaderPage from "../../../../utils/Header/Header";
import FooterPage from "../../../../utils/Footer/FooterPage";
import { Spinner } from "react-bootstrap";

export default function BrandPage() {
  const { brand_name } = useParams();
  const [allProductList, setAllProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [isBrandPage, setIsBrandPage] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(
        `${MainAPI}/product/getProductBrand?brand_name=${brand_name}&page=${page}&pageSize=12`
      )
      .then((res) => {
        console.log(res.data);
        setAllProductList([
          ...res.data.inStockProducts,
          ...res.data.outOfStockProducts,
        ]);
        setTotalPage(res.data.totalPages);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page, setPage]);
  // console.log(allProductList);

  // console.log(page);

  return (
    <>
      <HeaderPage />
      <div
        className="container d-flex align-items-center justify-content-center"
        style={{
          marginTop: "90px",
          justifyContent: "center",
        }}
      >
        {loading ? (
          <>
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          </>
        ) : (
          <>
            <ProductListShow
              productList={allProductList}
              changePage={(page) => {
                setPage(page);
              }}
              totalPage={totalPage}
              isBrandPage={isBrandPage}
            />
          </>
        )}
      </div>
      <FooterPage />
    </>
  );
}
