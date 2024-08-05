import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainAPI } from "../../API";
import { FaUserAlt } from "react-icons/fa";
import "./Review.scss";

export default function Review() {
  const { id } = useParams();
  const [dataConfirm, setDataConfirm] = useState({ reviews: [] });

  const fetchData = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      console.error("No access token found");
      return;
    }

    fetch(`${MainAPI}/user/show-reviews-by-product/${id}`, {
      method: "GET",
      headers: {
        "x-access-token": JSON.parse(token),
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => setDataConfirm(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  console.log(dataConfirm.reviews);
  return (
    <>
      <h3 style={{ margin: "2.5% 15%" }}> Đánh giá sản phẩm: </h3>
      <div className="container">
        <div className="row">
          <div className="col-md-12 ">
            <div className="review-container">
              {dataConfirm.reviews.length > 0 ? (
                dataConfirm.reviews.map((review, index) => (
                  <div className="review-card" key={index}>
                    <div className="ava">
                      <FaUserAlt />
                    </div>

                    <div className="review-content">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`star ${
                              i < review.rating ? "" : "star-grey"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="review-comment">{review.comment}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-reviews">Hiện chưa có đánh giá nào</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
