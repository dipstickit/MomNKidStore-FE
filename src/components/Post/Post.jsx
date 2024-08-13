
import React, { useContext, useEffect, useState } from "react";
import "./Post.scss";
import HeaderPage from "../../utils/Header/Header";
import FooterPage from "../../utils/Footer/FooterPage";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { MainAPI } from "../API";
import { formatVND } from "../../utils/Format";
import { CartContext } from "../Cart/CartContext";
import { FaShoppingCart } from "react-icons/fa";
import { Spinner } from "react-bootstrap";

const useFind = ({ list, id }) => {
  return list.find((item) => item.id === id);
};

export default function Post() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const { handleAddToCart } = useContext(CartContext);
  const [loading, setLoading] = useState(true);
  const quantity = 1;

  useEffect(() => {
    axios
      .get(`${MainAPI}/Blog/GetAllBlogByBlogId/${id}`)
      .then((res) => {
        setBlog(res.data);
        setRelatedProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // console.log(blog);

  return (
    <div style={{ "background-color": "#f5f7fd" }}>
      <HeaderPage />
      {loading ? (
        <>
          <div className="text-center" style={{ marginTop: "90px" }}>
            <Spinner animation="border" role="status" />
          </div>
        </>
      ) : (
        <>
          <div className="container">
            <div className="post-container">
              <div className="row">
                <div
                  className="editor col-md-9 editor-content"
                  dangerouslySetInnerHTML={{ __html: blog.description }}
                ></div>
                <div className="col-md-3">
                  {relatedProducts.map((product) => {
                    return (
                      <div key={product.product_id} className="product-card">
                        <Link
                          className="product-detail-link"
                          to={`/home/ProductDetail/${product.product_id}`}
                        >
                          <div className="home-product-detail-img-container">
                            <img src={product.image_url} alt={product.title} />
                          </div>
                          <div className="mt-2">{product.product_name}</div>
                          <div className="text-center">
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
                            onClick={() =>
                              handleAddToCart({ ...product, quantity })
                            }
                          >
                            <FaShoppingCart />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <FooterPage />
    </div>
  );
}
