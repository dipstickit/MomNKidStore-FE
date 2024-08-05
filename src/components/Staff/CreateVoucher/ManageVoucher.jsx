import React, { useEffect, useState } from "react";
import "./Voucher.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainAPI } from "../../API";
import { convertSQLDate } from "../../../utils/Format";
import { Spinner } from "react-bootstrap";

export default function ManageVoucher() {
  const [vouchers, setVouchers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [exDate, setExDate] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch(`${MainAPI}/staff/voucher`, {
      method: "GET",
      headers: {
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data get voucher");
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setVouchers(data);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching data voucher:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVoucher = () => {
    fetch(`${MainAPI}/staff/createVoucher`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
      body: JSON.stringify({
        discount: discount,
        expiration_date: exDate,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          // console.log(res.json());
          return res.json();
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          fetchData();
          setShowAdd(false);
          setExDate("");
          setDiscount("");
          toast.success("Voucher added successfully");
          console.log("Voucher added successfully");
        } else {
          toast.error(data.errors[0].message);
        }
      })
      .catch((error) => {
        console.error("Error adding voucher:", error);
      });
  };

  console.log(vouchers);

  return (
    <>
      {
        loading ? (
          <>
            <div className="spinner-voucher ">
              <Spinner animation="border" role="status" />
            </div>
          </>
        ) : (
          <>
            <ToastContainer />
            <div className="create-voucher-btn" style={{ textAlign: 'center' }}>
              <button className="btn btn-primary"
                style={{
                  border: "none",
                  borderRadius: "20px",
                  marginTop: "5%",
                  marginBottom: "5px",
                }}
                onClick={() => setShowAdd(true)}
              >
                Create Voucher
              </button>
            </div>
            <div className="voucher">
              {showAdd && (
                <div className="add-voucher" style={{ marginLeft: "10px", textAlign: 'left' }}>
                  <div className="add-voucher-detail">
                    <h4 style={{ marginLeft: '10px' }}>Create Voucher</h4>
                    <label className="code-dis">Discount (%):</label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(event) => setDiscount(event.target.value)}
                    />&nbsp;&nbsp;&nbsp;
                    <label>Expiration Date:</label>
                    <input
                      type="date"
                      value={exDate}
                      onChange={(event) => setExDate(event.target.value)}
                    />&nbsp;&nbsp;&nbsp;
                    <button className="add-cancel" onClick={handleAddVoucher}>
                      Create
                    </button>
                    <button className="add-cancel" onClick={() => setShowAdd(false)}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="voucher-th">
                <table className="table-voucher-th">
                  <thead>
                    <tr>
                      <th>Voucher ID</th>
                      <th>Code</th>
                      <th>Discount</th>
                      <th>Expiration_date</th>
                    </tr>
                  </thead>
                </table>
              </div>

              <div className="voucher-tb">
                <table className="table-voucher-tb">
                  <tbody>
                    {vouchers.map((voucher, index) => (
                      <tr key={index}>
                        <td>{voucher.voucher_id}</td>
                        <td>{voucher.code}</td>
                        <td>{voucher.discount}%</td>
                        <td>{convertSQLDate(voucher.expiration_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )
      }
    </>
  );
}
