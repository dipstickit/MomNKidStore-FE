import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { MdModeEdit } from "react-icons/md";
import { DeleteIcon } from "../../../utils/Icon/DeleteIcon";
import { MainAPI } from "../../API";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import "./Review.scss";

export default function Review() {
  const { productId } = useParams();
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackContent, setFeedbackContent] = useState("");
  const [rateNumber, setRateNumber] = useState(0);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.customerId) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
    fetchData();
  }, [productId]);

  const fetchData = () => {
    fetch(`${MainAPI}/Feedback/GetAllFeedback/${productId}`, {
      method: "GET",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => setFeedbacks(data))
      .catch((error) => console.error("Error fetching data:", error));
  };

  const getCustomerIdFromToken = () => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (!token) {
      toast.error("No access token found");
      return null;
    }
    try {
      const decoded = jwtDecode(token);
      return decoded.customerId;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (!token) {
      toast.error("No access token found");
      return;
    }
  
    const customerId = getCustomerIdFromToken();
    if (!customerId) {
      toast.error("Failed to retrieve customer ID");
      return;
    }
  
    try {
      const response = await fetch(`${MainAPI}/Feedback/${feedbackId}/${customerId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        toast.success("Feedback deleted successfully");
        fetchData(); // Refresh data after deletion
      } else {
        toast.error("Failed to delete feedback");
      }
    } catch (error) {
      toast.error("Error deleting feedback");
      console.error("Error:", error);
    }
  };
  

  const handleEditFeedback = (feedback) => {
    setFeedbackContent(feedback.feedbackContent);
    setRateNumber(feedback.rateNumber);
    setEditingFeedback(feedback);
    setIsFormVisible(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("accessToken"));
    if (!token) {
      toast.error("No access token found");
      return;
    }

    const customerId = getCustomerIdFromToken();
    if (!customerId) {
      toast.error("Failed to retrieve customer ID");
      return;
    }

    const feedbackData = {
      customerId: customerId,
      productId: productId,
      feedbackContent,
      rateNumber,
    };

    const apiUrl = editingFeedback
      ? `${MainAPI}/Feedback/UpdateFeedback/${editingFeedback.feedbackId}`
      : `${MainAPI}/Feedback/CreateFeedback`;

    const method = editingFeedback ? "PUT" : "POST";

    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(feedbackData),
      });

      if (response.ok) {
        toast.success(
          editingFeedback
            ? "Feedback updated successfully"
            : "Feedback submitted successfully"
        );
        setFeedbackContent("");
        setRateNumber(0);
        setIsFormVisible(false);
        setEditingFeedback(null);
        fetchData();
      } else {
        toast.error(
          editingFeedback ? "Failed to update feedback" : "Failed to submit feedback"
        );
      }
    } catch (error) {
      toast.error(
        editingFeedback ? "Error updating feedback" : "Error submitting feedback"
      );
      console.error("Error:", error);
    }
  };

  const handleCancelEdit = () => {
    setFeedbackContent("");
    setRateNumber(0);
    setEditingFeedback(null);
    setIsFormVisible(false);
  };

  return (
    <>
      <h3 style={{ margin: "2.5% 15%" }}>Đánh giá sản phẩm:</h3>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="review-container">
              {feedbacks.length > 0 ? (
                feedbacks.map((feedback, index) => (
                  <div className="review-card" key={index}>
                    <div className="ava">
                      <FaUserAlt />
                    </div>

                    <div className="review-content">
                      <div className="review-header">
                        <span className="review-username">
                          {feedback.customer.userName}
                        </span>
                      </div>

                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`star ${i < feedback.rateNumber ? "" : "star-grey"
                              }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      <p className="review-comment">
                        {feedback.feedbackContent}
                      </p>
                    </div>

                    {/* Action buttons only if logged in */}
                    {isLoggedIn && (
                      <div className="review-actions">
                        <MdModeEdit color="green"
                          className="edit-icon"
                          onClick={() => handleEditFeedback(feedback)}
                        />
                        <DeleteIcon color="red"
                          className="delete-icon"
                          onClick={() => handleDeleteFeedback(feedback.feedbackId)}
                        />
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="no-reviews">Hiện chưa có đánh giá nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Show form only if logged in */}
        {isLoggedIn && (
          <div className="row">
            <div className="col-md-12">
              <button
                onClick={() => {
                  if (editingFeedback) {
                    handleCancelEdit(); // Reset form if editing is ongoing
                  } else {
                    setIsFormVisible(!isFormVisible);
                  }
                }}
                className="btn-toggle-form"
              >
                {isFormVisible
                  ? editingFeedback
                    ? "Hủy chỉnh sửa"
                    : "Ẩn form đánh giá"
                  : "Viết đánh giá"}
              </button>
            </div>
          </div>
        )}

        {/* Form to submit feedback, visible based on isFormVisible state */}
        {isFormVisible && (
          <div className="row">
            <div className="col-md-12">
              <form onSubmit={handleSubmitFeedback} className="feedback-form">
                <h4>{editingFeedback ? "Chỉnh sửa đánh giá của bạn:" : "Để lại đánh giá của bạn:"}</h4>
                <div className="form-group">
                  <label htmlFor="rateNumber">Số sao:</label>
                  <select
                    id="rateNumber"
                    value={rateNumber}
                    onChange={(e) => setRateNumber(Number(e.target.value))}
                    required
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="feedbackContent">Nội dung đánh giá:</label>
                  <textarea
                    id="feedbackContent"
                    value={feedbackContent}
                    onChange={(e) => setFeedbackContent(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-submit">
                  {editingFeedback ? "Cập nhật đánh giá" : "Gửi đánh giá"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Show login prompt if not logged in */}
        {!isLoggedIn && (
          <div className="row">
            <div className="col-md-12">
              <p className="login-prompt">
                Bạn cần <a href="/login">đăng nhập</a> để viết đánh giá.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
