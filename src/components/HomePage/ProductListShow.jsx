// import { useContext, useEffect, useState } from "react";
// import { categoryList, ageList } from "./category";
// import "./Product.scss";
// import { FaShoppingCart } from "react-icons/fa";
// import { CartContext } from "../Cart/CartContext";
// import { formatVND } from "../../utils/Format";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "axios";
// import { MainAPI } from "../API";
// import { Link, useParams } from "react-router-dom";
// import { Spinner } from "react-bootstrap";

// export default function ProductListShow({
//   productList,
//   changePage,
//   totalPage,
// }) {
//   const { handleAddToCart } = useContext(CartContext);
//   const [ageFilters, setAgeFilters] = useState([]);
//   const [countryFilters, setCountryFilters] = useState([]);
//   const [filteredItems, setFilteredItems] = useState([]);
//   const [productListAll, setProductListAll] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPageAll, setTotalPageAll] = useState(0);
//   const [filterPage, setFilterPage] = useState(0);
//   const itemsPerPage = 12;
//   const { brand_name } = useParams();
//   const [loading, setLoading] = useState(true);
//   const quantity = 1;

//   useEffect(() => {
//     axios
//       .get(`${MainAPI}/product/getAllProductWithoutPagination`)
//       .then((res) => {
//         setProductListAll(res.data.inStockProducts);
//         setLoading(false);
//         // console.log(res.data.inStockProducts);
//       })
//       .catch((err) => console.log(err));
//   }, []);

//   const handleFilterButtonClick = (
//     selectedCategory,
//     selectedFilters,
//     setSelectedFilters
//   ) => {
//     if (selectedFilters.includes(selectedCategory)) {
//       setSelectedFilters(
//         selectedFilters.filter((category) => category !== selectedCategory)
//       );
//     } else {
//       setSelectedFilters([...selectedFilters, selectedCategory]);
//     }
//   };

//   //FILTER ITEMS // Nếu đang chưa filter mà đang ở trang 2 thì khi filter (data trả về có về 1 trang) thì sẽ bị lỗi (vì currentPage vẫn là 2)
//   const fetchDataFilter = () => {
//     axios
//       .post(`${MainAPI}/product/filter?page=${currentPage}`, {
//         country: countryFilters,
//         ageRange: ageFilters,
//       })
//       .then((res) => {
//         console.log(res.data);
//         if (res.data.inStockProducts) {
//           setFilteredItems([
//             ...res.data.inStockProducts,
//             ...res.data.outOfStockProducts,
//           ]);
//           setFilterPage(res.data.totalPages);
//           setLoading(false);
//         } else {
//           setFilteredItems([]);
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   //SET TOTAL PAGE
//   useEffect(() => {
//     if (ageFilters.length > 0 || countryFilters.length > 0) {
//       fetchDataFilter();
//       setTotalPageAll(filterPage);
//     } else {
//       setTotalPageAll(totalPage);
//     }
//   }, [totalPage, filterPage, ageFilters, countryFilters, currentPage]);

//   const totalPages = totalPageAll;

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     changePage(pageNumber);
//   };

//   return (
//     <div
//       className={brand_name !== undefined ? "filterBrand" : "fillter_container"}
//     >
//       {/* <ToastContainer autoClose={2000} /> */}
//       <>
//         <div className="type">
//           <div className="category">
//             <p className="m-0">Loại Sữa:</p>
//             <div style={{ marginLeft: "25px" }}>
//               {categoryList.map((cate, index) => (
//                 <div className="cate" key={cate.id}>
//                   <button
//                     onClick={() => {
//                       handleFilterButtonClick(
//                         cate.country,
//                         countryFilters,
//                         setCountryFilters
//                       );
//                     }}
//                     className={`btn ${countryFilters?.includes(cate.country) ? "active" : ""
//                       }`}
//                     key={`filters-${index}`}
//                   >
//                     {cate.title}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//           <div className="category">
//             <p className="m-0">Độ tuổi:</p>
//             <div style={{ marginLeft: "25px" }}>
//               {ageList.map((age, index) => (
//                 <div className="cate" key={age.id}>
//                   <button
//                     onClick={() => {
//                       handleFilterButtonClick(
//                         age.title,
//                         ageFilters,
//                         setAgeFilters
//                       );
//                     }}
//                     className={`btn ${ageFilters?.includes(age.title) ? "active" : ""
//                       }`}
//                     key={`filters-${index}`}
//                   >
//                     {age.title}
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </>

//       <div className="product_detail text-center d-flex flex-column">
//         {loading ? (
//           <>
//             <div className="text-center">
//               <Spinner animation="border" role="status" />
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="row row-cols-4 cardRow">
//               {ageFilters.length > 0 || countryFilters.length > 0 ? (
//                 <>
//                   {filteredItems.map((product) => (
//                     <div key={product.product_id} className="product-card col">
//                       <Link
//                         className="product-detail-link"
//                         to={`/home/ProductDetail/${product.product_id}`}
//                       >
//                         <div className="home-product-detail-img-container">
//                           <img src={product.image_url} alt={product.title} />
//                         </div>
//                         <div className="mt-2">{product.product_name}</div>
//                         <div>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span style={{ fontSize: "10px" }}>
//                             {product.sale}
//                           </span>
//                         </div>
//                       </Link>
//                       <div
//                         style={{
//                           display: "flex",
//                           marginTop: "10px",
//                           justifyContent: "space-around",
//                         }}
//                       >
//                         <div>{formatVND(product.price)}</div>
//                         <div
//                           className="icon_cart"
//                           onClick={() => handleAddToCart({ ...product, quantity })}
//                         >
//                           <FaShoppingCart />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               ) : (
//                 <>
//                   {productList.map((product) => (
//                     <div key={product.product_id} className="product-card col">
//                       <Link
//                         className={
//                           product.stock <= 0
//                             ? "sold-out"
//                             : "product-detail-link"
//                         }
//                         to={`/home/ProductDetail/${product.product_id}`}
//                       >
//                         <div className="home-product-detail-img-container">
//                           <img src={product.image_url} alt={product.title} />
//                           {product.stock <= 0 && (
//                             <button className="sold-out-button">
//                               Sold Out
//                             </button>
//                           )}
//                         </div>
//                         <div className="mt-2">{product.product_name}</div>
//                         <div>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span className="star">★</span>
//                           <span style={{ fontSize: "10px" }}>
//                             {product.sale}
//                           </span>
//                         </div>
//                       </Link>
//                       <div
//                         style={{
//                           display: "flex",
//                           marginTop: "10px",
//                           justifyContent: "space-around",
//                         }}
//                       >
//                         <div>{formatVND(product.price)}</div>
//                         <div
//                           className="icon_cart"
//                           onClick={() => handleAddToCart({ ...product, quantity })}
//                         >
//                           <FaShoppingCart />
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </>
//               )}
//             </div>
//           </>
//         )}
//         <div className="pagination">
//           {Array.from({ length: totalPages }, (_, index) => (
//             <button
//               key={index}
//               onClick={() => handlePageChange(index + 1)}
//               className={`pagination-button ${index + 1 === currentPage ? "active" : ""
//                 }`}
//             >
//               {index + 1}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

import { useContext, useEffect, useState } from "react";
import { categoryList, ageList } from "./category";
import "./Product.scss";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../Cart/CartContext";
import { formatVND } from "../../utils/Format";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

export default function ProductListShow({
  productList,
  changePage,
  totalPage,
}) {
  const { handleAddToCart } = useContext(CartContext);
  const [ageFilters, setAgeFilters] = useState([]);
  const [countryFilters, setCountryFilters] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { brand_name } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageAll, setTotalPageAll] = useState(0);
  const itemsPerPage = 12;

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products`)
      .then((res) => {
        setFilteredItems(res.data);
        setTotalPageAll(Math.ceil(res.data.length / itemsPerPage));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFilterButtonClick = (
    selectedCategory,
    selectedFilters,
    setSelectedFilters
  ) => {
    if (selectedFilters.includes(selectedCategory)) {
      setSelectedFilters(
        selectedFilters.filter((category) => category !== selectedCategory)
      );
    } else {
      setSelectedFilters([...selectedFilters, selectedCategory]);
    }
  };

  const fetchDataFilter = () => {
    axios
      .post(`http://localhost:5000/categories`, {
        country: countryFilters,
        ageRange: ageFilters,
      })
      .then((res) => {
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (ageFilters.length > 0 || countryFilters.length > 0) {
      fetchDataFilter();
    } else {
      axios
        .get(`http://localhost:5000/products`)
        .then((res) => {
          setFilteredItems(res.data);
          setTotalPageAll(Math.ceil(res.data.length / itemsPerPage));
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [ageFilters, countryFilters, currentPage]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    changePage(pageNumber);
  };

  return (
    <div
      className={brand_name !== undefined ? "filterBrand" : "fillter_container"}
    >
      <div className="type">
        <div className="category">
          <p className="m-0">Loại Sữa:</p>
          <div style={{ marginLeft: "25px" }}>
            {categoryList.map((cate) => (
              <div className="cate" key={cate.id}>
                <button
                  onClick={() => {
                    handleFilterButtonClick(
                      cate.country,
                      countryFilters,
                      setCountryFilters
                    );
                  }}
                  className={`btn ${countryFilters?.includes(cate.country) ? "active" : ""}`}
                >
                  {cate.title}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="category">
          <p className="m-0">Độ tuổi:</p>
          <div style={{ marginLeft: "25px" }}>
            {ageList.map((age) => (
              <div className="cate" key={age.id}>
                <button
                  onClick={() => {
                    handleFilterButtonClick(
                      age.title,
                      ageFilters,
                      setAgeFilters
                    );
                  }}
                  className={`btn ${ageFilters?.includes(age.title) ? "active" : ""}`}
                >
                  {age.title}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="product_detail text-center d-flex flex-column">
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" role="status" />
          </div>
        ) : (
          <div className="row row-cols-4 cardRow">
            {filteredItems.map((product) => (
              <div key={product.id} className="product-card col">
                <Link
                  className={
                    product.stock <= 0
                      ? "sold-out"
                      : "product-detail-link"
                  }
                  to={`/home/ProductDetail/${product.id}`}
                >
                  <div className="home-product-detail-img-container">
                    <img src={product.image_url} alt={product.product_name} />
                    {product.stock <= 0 && (
                      <button className="sold-out-button">
                        Sold Out
                      </button>
                    )}
                  </div>
                  <div className="mt-2">{product.product_name}</div>
                  <div>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span className="star">★</span>
                    <span style={{ fontSize: "10px" }}>
                      {product.sale}
                    </span>
                  </div>
                </Link>
                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    justifyContent: "space-around",
                  }}
                >
                  <div>{formatVND(product.price)}</div>
                  <div
                    className="icon_cart"
                    onClick={() => handleAddToCart({ ...product, quantity: 1 })}
                  >
                    <FaShoppingCart />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="pagination">
          {Array.from({ length: totalPageAll }, (_, index) => (
            <button
              key={index}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-button ${index + 1 === currentPage ? "active" : ""}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
