import { useEffect, useState } from "react";
import axios from "axios";
import ProductListShow from "../../ProductListShow";
import { MainAPI } from "../../../API";
export default function FillterType() {
  const [allProductList, setAllProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  // useEffect(() => {
  //   axios
  //     .get(`${MainAPI}/Product/get-all-products?page=${page}&pageSize=10`)
  //     .then((res) => {
  //       console.log("API Response:", res.data);
  //       setAllProductList(Array.isArray(res.data.productList) ? res.data.productList : []);
  //       setTotalPage(res.data.totalPage);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setAllProductList([]);
  //     });
  // }, [page]);
  return (
    <ProductListShow
      productList={allProductList}
      changePage={(page) => setPage(page)}
      totalPage={totalPage}
    />
  );
}
