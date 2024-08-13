import { useEffect, useState } from "react";
import axios from "axios";
import ProductListShow from "../../ProductListShow";
import { MainAPI } from "../../../API";
export default function FillterType() {
  const [allProductList, setAllProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    axios
      .get(`${MainAPI}/products?_page=${page}&_limit=10`)
      .then((res) => {
        setAllProductList(res.data);
        const totalPages = parseInt(res.headers['x-total-count'] / 12, 10);
        setTotalPage(totalPages);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [page]);

  return (
    <ProductListShow
      productList={allProductList}
      changePage={(page) => setPage(page)}
      totalPage={totalPage}
    />
  );
}
