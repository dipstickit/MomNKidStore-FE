import { useEffect, useState } from "react";
import axios from "axios";
import ProductListShow from "../../ProductListShow";
import { MainAPI } from "../../../API";
export default function FillterType() {
  const [allProductList, setAllProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  return (
    <ProductListShow
      productList={allProductList}
      changePage={(page) => setPage(page)}
      totalPage={totalPage}
    />
  );
}
