import { useContext, useEffect, useState } from "react";
import "./Product.scss";
import { FaShoppingCart } from "react-icons/fa";
import { CartContext } from "../Cart/CartContext";
import { formatVND } from "../../utils/Format";
import { Spinner } from "react-bootstrap";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { MainAPI } from "../../components/API"; // Đường dẫn điều chỉnh

export default function ProductListShow({ productList, changePage, totalPage }) {
  const { handleAddToCart } = useContext(CartContext);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { brand_name } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPageAll, setTotalPageAll] = useState(0);
  const itemsPerPage = 5; // Đặt pageSize mặc định là 5
  const [categories, setCategories] = useState([]); // Trạng thái mới cho danh mục
  const [selectedCategory, setSelectedCategory] = useState(null); // Trạng thái cho danh mục đang được chọn

  // Lấy tất cả sản phẩm ban đầu
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${MainAPI}/Product/get-all-products?page=${currentPage}&pageSize=${itemsPerPage}`)
      .then((res) => {
        setFilteredItems(res.data.productList); // Ensure `filteredItems` is set correctly
        setTotalPageAll(Math.ceil(res.data.totalPage / itemsPerPage)); // Assuming `totalPage` is returned from API
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [currentPage, itemsPerPage]);


  // useEffect mới để lấy danh mục
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
    setSelectedCategory(categoryId);
    axios
      .get(`${MainAPI}/Product/get-all-products?CategoryId=${categoryId}&page=${currentPage}&pageSize=${itemsPerPage}`)
      .then((res) => {
        setFilteredItems(res.data);
        setTotalPageAll(Math.ceil(res.data.length / itemsPerPage));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setFilteredItems([]);
        setLoading(false);
      });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
    axios
      .get(`${MainAPI}/Product/get-all-products?page=${page}&pageSize=${itemsPerPage}`)
      .then((res) => {
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
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
                  className={`btn ${selectedCategory === cate.productCategoryId ? "active" : ""}`}
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
                  <div key={product.productId} className="product-card col">
                    <Link className="product-detail-link" to={`/home/ProductDetail/${product.productId}`}>
                      <div className="home-product-detail-img-container">
                        {product.images.length > 0 ? (
                          <img
                            src={`data:image/png;base64,${product.images[0].imageProduct}`}
                            alt={product.productName}
                            style={{ maxWidth: "100%", height: "auto" }}
                          />
                        ) : (
                          <img
                            src="public/assest/images/product/aptamil-profutura-duobiotik-2-danh-cho-tre-tu-6-12-thang-tuoi-800g.png"
                            alt="Placeholder"
                            style={{ maxWidth: "100%", height: "auto" }}
                          />
                        )}
                      </div>
                      <div className="mt-2">{product.productName}</div>
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
                      <div>{formatVND(product.productPrice)}</div>
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
