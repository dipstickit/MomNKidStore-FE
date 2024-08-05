import React, { useEffect, useState } from "react";
import HeaderPage from "../../../utils/Header/Header";
import FooterPage from "../../../utils/Footer/FooterPage";
import axios from "axios";
import { MainAPI } from "../../API";
import { useLocation } from "react-router-dom";
import ProductListShow from "../ProductListShow";
import { Spinner } from "react-bootstrap";

export default function SearchPage() {
  const location = useLocation();
  const [searchResult, setSearchResult] = useState([]);
  const searchTerm = new URLSearchParams(location.search).get("search_query");
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${MainAPI}/product/search?searchTerm=${searchTerm}&page=${page}`)
      .then((res) => {
        console.log(res.data);
        if (res.data.inStockProducts && res.data.outOfStockProducts) {
          setSearchResult([
            ...res.data.inStockProducts,
            ...res.data.outOfStockProducts,
          ]);
        } else {
          setSearchResult(res.data);
        }

        setTotalPage(res.data.totalPages);
        setLoading(false);
        // nav("/search", { searchResult: res.data });
      })
      .catch((err) => {
        console.log(err);
      });
  }, [searchTerm, page]);

  // console.log(searchResult);

  return (
    <div>
      <HeaderPage />
      <div className="container">
        {loading ? (
          <>
            <div className="text-center" style={{ marginTop: "120px" }}>
              <Spinner animation="border" role="status" />
            </div>
          </>
        ) : (
          <>
            {searchResult.length === 0 ? (
              <>
                <div className="emptyinfo" style={{ marginTop: "80px" }}>
                  <img
                    style={{ width: "30%", margin: "50px 0 auto" }}
                    src="https://firebasestorage.googleapis.com/v0/b/swp391-milkmartsystem.appspot.com/o/images%2Fsearch-empty.png?alt=media&token=478bd46a-1d79-47f3-bcab-898248bc04d5"
                  />
                  <p>Chưa tìm thấy kết quả phù hợp</p>
                </div>
              </>
            ) : (
              <>
                {" "}
                <div style={{ marginTop: "80px" }}>
                  <ProductListShow
                    productList={searchResult}
                    changePage={(page) => {
                      setPage(page);
                    }}
                    totalPage={totalPage}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>
      <FooterPage />
    </div>
  );
}
