// import { useEffect, useState } from "react";
// import axios from "axios";
// import { MainAPI } from "../../../API";
// import ProductListShow from "../../ProductListShow";

// export default function FillterType() {
//   const [allProductList, setAllProductList] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalPage, setTotalPage] = useState(0);

//   useEffect(() => {
//     axios
//       .get(`${MainAPI}/product/getProduct?page=${page}&pageSize=12`)
//       .then((res) => {
//         // console.log(res.data.inStockProducts);
//         setAllProductList([
//           ...res.data.inStockProducts,
//           ...res.data.outOfStockProducts,
//         ]);
//         setTotalPage(res.data.totalPages);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }, [page, setPage]);
//   // console.log(allProductList);

//   // console.log(page);

//   return (
//     <ProductListShow
//       productList={allProductList}
//       changePage={(page) => {
//         setPage(page);
//       }}
//       totalPage={totalPage}
//     />
//   );
// }

import { useEffect, useState } from "react";
import axios from "axios";
import ProductListShow from "../../ProductListShow";

export default function FillterType() {
  const [allProductList, setAllProductList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products?_page=${page}&_limit=10`)
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
