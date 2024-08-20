import React, { useEffect, useState } from "react";
import "./Voucher.scss";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import { MainAPI } from "../../../API";

export default function Voucher() {
  const [voucherList, setVoucherList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${MainAPI}/VoucherOfShop`);
        setVoucherList(response.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="voucher-container p-4">
      <h2 className="voucher-title">Get voucher</h2>
      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status" />
        </div>
      ) : (
        <Slide
          transitionDuration={200}
          slidesToScroll={1}
          slidesToShow={3}
          autoplay={false}
          responsive={[
            {
              breakpoint: 800,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 1,
              },
            },
            {
              breakpoint: 500,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
              },
            },
          ]}
        >
          {voucherList.map((voucher) => (
            <div key={voucher.voucherId} className="each-slide">
              <div className="first-part">
                <p>{voucher.voucherValue}%</p>
              </div>
              <div className="second-part">
                <p>All products</p>
                <p>HSD: {voucher.endDate}</p>
              </div>
            </div>
          ))}
        </Slide>
      )}
    </div>
  );
}