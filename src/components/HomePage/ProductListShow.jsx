import { useContext, useEffect, useState } from "react";
import "./Product.scss";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../Cart/CartContext";
import { formatVND } from "../../utils/Format";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { MainAPI } from "../../components/API"; // Adjusted the import path

export default function ProductListShow({ productList, changePage, totalPage }) {
  const { handleAddToCart } = useContext(CartContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { brand_name } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageAll, setTotalPageAll] = useState(0);
  const itemsPerPage = 12;
  const [categories, setCategories] = useState([]); // New state for categories

  useEffect(() => {
    axios
      .get(`${MainAPI}/products`)
      .then((res) => {
        setFilteredItems(res.data);
        setTotalPageAll(Math.ceil(res.data.length / itemsPerPage));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // New useEffect for fetching categories
  useEffect(() => {
    axios
      .get(`${MainAPI}/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleFilterButtonClick = (categoryId) => {
    setLoading(true);
    axios
      .get(`${MainAPI}/Product/get-all-products?CategoryId=${categoryId}`)
      .then((res) => {
        setFilteredItems(res.data);
        setTotalPageAll(Math.ceil(res.data.length / itemsPerPage));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFilteredItems([]); // Clear the filtered items on error
        setLoading(false);
      });
  };

  return (
    <div className={brand_name !== undefined ? "filterBrand" : "fillter_container"}>
      <div className="type">
        <div className="category">
          <p className="m-0">Loại Sữa:</p>
          <div style={{ marginLeft: "25px" }}>
            {categories.map((cate) => (
              <div className="cate" key={cate.productCategoryId}>
                <button
                  onClick={() => handleFilterButtonClick(cate.productCategoryId)}
                  className={`btn ${
                    filteredItems?.some(item => item.productCategoryId === cate.productCategoryId) ? "active" : ""
                  }`}
                >
                  {cate.productCategoryName}
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
          <>
            {filteredItems.length === 0 ? (
              <div className="no-products">Không có sản phẩm nào</div>
            ) : (
              <div className="row row-cols-4 cardRow">
                {filteredItems.map((product) => (
                  <div key={product.id} className="product-card col">
                    <Link
                      className={product.stock <= 0 ? "sold-out" : "product-detail-link"}
                      to={`/home/ProductDetail/${product.id}`}
                    >
                      <div className="home-product-detail-img-container">
                        <img src={product.image_url} alt={product.product_name} />
                        {product.stock <= 0 && (
                          <button className="sold-out-button">Sold Out</button>
                        )}
                      </div>
                      <div className="mt-2">{product.product_name}</div>
                      <div>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span className="star">★</span>
                        <span style={{ fontSize: "10px" }}>{product.sale}</span>
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
                      <div className="icon_cart" onClick={() => handleAddToCart({ ...product, quantity: 1 })}>
                        <FaShoppingCart />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
