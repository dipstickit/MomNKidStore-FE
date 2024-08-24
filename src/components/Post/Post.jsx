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
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export default function Post() {
  const { id } = useParams();
  const [blog, setBlog] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const quantity = 1;

  useEffect(() => {
    axios
      .get(`${MainAPI}/Blog/GetAllBlogByBlogId/${id}`)
      .then((res) => {
        setBlog(res.data);
        setRelatedProducts(res.data.blogProducts);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);
  const handleAddToCart = async (selectedProduct) => {
    console.log('Selected product:', selectedProduct);

    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (!token) {
      toast.error("You need to login to add products to cart.");
      return;
    }

    const decodedToken = jwtDecode(token);
    const customerId = decodedToken.customerId;

    try {
      const response = await axios.post(
        `${MainAPI}/Cart`,
        {
          productId: selectedProduct.productId,
          customerId: customerId,
          cartQuantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      if (response.status === 200 || response.status === 201) {
        toast.success("Product has been added to cart!");
      } else {
        toast.error("An error occurred while adding the product to the cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("An error occurred while adding the product to the cart.");
    }
  };
  return (
    <div style={{ backgroundColor: "#f5f7fd" }}>
      <HeaderPage />
      {loading ? (
        <div className="text-center" style={{ marginTop: "90px" }}>
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <div className="container">
          <div className="post-container">
            <div className="row">
              <div className="editor col-md-9 editor-content">
                <h1>{blog.blogTitle}</h1> {/* Displaying Blog Title */}
                <p>{blog.blogContent}</p> {/* Displaying Blog Content */}
                <img
                  src={blog.blogImage || "https://via.placeholder.com/150"}
                  alt={blog.blogTitle || "Placeholder"}
                  className="img-fluid mb-3"
                />
              </div>
              <div className="col-md-3">
                <h4>Related Products</h4>
                {relatedProducts.map((product) => (
                  <div key={product.productId} className="product-card mb-4">
                    <Link
                      className="product-detail-link"
                      to={`/home/ProductDetail/${product.productId}`}
                    >
                      <div className="home-product-detail-img-container mb-2">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0].imageProduct1 || "https://via.placeholder.com/150"}
                            alt={product.productName || "Placeholder"}
                          />
                        ) : (
                          <img
                            src="https://via.placeholder.com/150"
                            alt="Placeholder"
                          />
                        )}
                      </div>
                      <div className="product-name">{product.productName}</div>
                      <div className="product-infor">{product.productInfor}</div>
                      <div className="product-price mt-2">
                        {formatVND(product.productPrice)}
                      </div>
                    </Link>
                    <div
                      className="icon_cart mt-2"
                      onClick={() => handleAddToCart({ ...product })}
                    >
                      <FaShoppingCart />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      <FooterPage />
    </div>
  );
}
