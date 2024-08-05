import React, { useEffect, useState } from "react";
import "./Inventory.scss";
import { BsJournalCheck } from "react-icons/bs";
import { MdDeleteOutline, MdOutlineInventory } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MainAPI } from "../../API";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import { convertSQLDate } from "../../../utils/Format";
import { Spinner } from "react-bootstrap";

Modal.setAppElement("#root");

export default function ManageInventory() {
  const [inventory, setInventory] = useState([]);
  const [proDetails, setProDetails] = useState([]);
  const nav = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visible, setVisible] = useState(null);
  const [proDate, setProDate] = useState("");
  const [exDate, setExDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [proID, setProID] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    fetch(`${MainAPI}/staff/product`, {
      method: "GET",
      headers: {
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch data");
        return res.json();
      })
      .then((data) => {
        setInventory(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  const fetchDataDetail = (id) => {
    fetch(`${MainAPI}/staff/show-product-details/${id}`, {
      method: "GET",
      headers: {
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch product details");
        return res.json();
      })
      .then((data) => setProDetails(data))
      .catch((error) => console.error("Error fetching product details:", error));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditProductClick = (product) => {
    nav(`/edit-product/${product.product_id}`);
  };

  const handleDeleteExpProduct = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete all expired product?"
    );

    if (confirmed) {
      handleConfirmDelete();
    }
  };

  const handleDeleteEachProduct = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete product?"
    );

    if (confirmed) {
      handleDeleteProduct(id);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`${MainAPI}/staff/export/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      });

      const data = await response.json();

      if (data.status === 200) {
        toast.success("Delete product successfully");
        fetchData();
      } else {
        toast.error(data.errors[0].message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${MainAPI}/staff/delete-expired-product`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      });

      const data = await response.json();

      if (data.status === 200) {
        toast.success("Delete all expired product successfully");
        fetchData();
      } else {
        toast.error(data.errors[0].message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditDetail = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    setProID(product.product_id);
    fetchDataDetail(product.product_id);
  };

  const handleAdd = (id) => {
    console.log(id)
    fetch(`${MainAPI}/staff/add-product-details/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
      },
      body: JSON.stringify({
        product_id: id,
        production_date: proDate,
        expiration_date: exDate,
        quantity: quantity,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json();
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          setExDate("");
          setProDate("");
          setQuantity("");
          setShow(false);
          fetchDataDetail(proID);
          toast.success("Quantity added successfully");
          console.log("Quantity added successfully");
        } else {
          toast.error(data.errors[0].message);
        }
      })
      .catch((error) => {
        console.error("Error adding Quantity:", error);
      });
  };

  const columns = [
    {
      name: "Product ID",
      selector: (row) => row.product_id,
      sortable: true,
      center: true,
      wrap: true,
      style: {
        fontSize: "12px",
        textAlign: "center",
      },
    },
    {
      name: "Brand",
      selector: (row) => row.brand_name,
      sortable: true,
      center: true,
      wrap: true,
      style: { fontSize: "12px", textAlign: "center" },
    },
    {
      name: "Image",
      cell: (row) => (
        <img
          src={row.image_url}
          alt="Product"
          style={{ width: "55px", height: "70px" }}
        />
      ),
      center: true,
    },
    {
      name: "Product",
      selector: (row) => row.product_name,
      sortable: true,
      center: true,
      wrap: true,
      style: { fontSize: "12px", textAlign: "center" },
    },
    {
      name: "Price",
      selector: (row) => row.price,
      sortable: true,
      center: true,
      style: { fontSize: "12px", textAlign: "center" },
    },
    {
      name: "Country ID",
      selector: (row) => row.country_id,
      sortable: true,
      center: true,
      style: { fontSize: "12px", textAlign: "center" },
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      center: true,
      wrap: true,
      style: { fontSize: "12px", textAlign: "center" },
    },
    {
      name: "Age Range",
      selector: (row) => row.age_range,
      sortable: true,
      center: true,
      wrap: true,
      style: { fontSize: "12px", textAlign: "center" },
    },
    {
      name: "Stock",
      selector: (row) => row.stock,
      sortable: true,
      center: true,
      style: { fontSize: "12px", textAlign: "center" },
    },
    {
      cell: (row) => (
        <div className="action">
          <button title="Chỉnh sửa sản phẩm" className="icon_btn" onClick={() => handleEditProductClick(row)}>
            <BsJournalCheck color="green" />
          </button>
          <button title="Xem chi tiết sản phẩm" className="icon_btn" onClick={() => handleEditDetail(row)}>
            <MdOutlineInventory color="#0066cc" fontSize="16px" />
          </button>
          <button title="Xóa sản phẩm" className="icon_btn" onClick={() => handleDeleteEachProduct(row.product_id)}>
            <MdDeleteOutline color="red" fontSize="17px" />
          </button>
        </div>
      ),
      center: true,
    },
  ];

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '700px',
      height: '420px',
      borderRadius: '20px',
    },
  };

  const handleCancel = () => {
    setProID("");
    setExDate("");
    setProDate("");
    setQuantity("");
    setShow(false);
  }

  return (
    <div className="manage-inventory-container">
      {
        loading ? (
          <>
            <div className="spinner-container ">
              <Spinner animation="border" role="status" />
            </div>
          </>
        ) : (
          <>
            <ToastContainer />
            <div >
              <div style={{ textAlign: 'center' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    nav("/create-product");
                  }}
                >
                  Add Product
                </button>

                <button
                  className="btn btn-danger" style={{ marginLeft: "20px" }}
                  onClick={() => handleDeleteExpProduct()}
                >
                  Delete Expired Product
                </button>
              </div>

              <div className="table-inven">
                <DataTable
                  pagination
                  paginationPerPage={4}
                  paginationRowsPerPageOptions={[4, 6]}
                  columns={columns}
                  data={inventory}
                  className="table-content"
                />
              </div>
            </div>
            {showModal && selectedProduct && (
              <Modal
                isOpen={showModal}
                onRequestClose={closeModal}
                contentLabel="Edit Product"
                style={customStyles}
              >
                <h2>Product Detail</h2>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <button className="btn btn-primary" onClick={() => setShow(true)}>
                    Add Quantity
                  </button>

                  <button onClick={closeModal} className="btn btn-secondary">
                    Close
                  </button>
                </div>

                {
                  show && (
                    <div >
                      <h4>Add quantity product</h4>
                      <div style={{ marginBottom: '10px' }}>
                        <label>Quantity:</label>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(event) => setQuantity(event.target.value)}
                        />
                      </div>

                      <div>
                        <label>Production Date:</label>
                        <input
                          type="date"
                          value={proDate}
                          onChange={(event) => setProDate(event.target.value)}
                        />
                        <label>Expiration Date:</label>
                        <input
                          type="date"
                          value={exDate}
                          onChange={(event) => setExDate(event.target.value)}
                        />
                      </div>

                      <button className="btn btn-primary" style={{ marginTop: "10px" }} onClick={() => handleAdd(proID)}>
                        Create
                      </button>
                      <button className="btn btn-danger" style={{ marginTop: "10px", marginLeft: '20px' }} onClick={() => handleCancel()}>
                        Cancel
                      </button>
                    </div>
                  )
                }

                <div>
                  <table
                    className="table-prodetail"
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ borderBottom: "1px solid black" }}>
                        <th
                          style={{
                            padding: "5px",
                            textAlign: "center",

                          }}
                        >
                          Production Date
                        </th>
                        <th
                          style={{
                            padding: "20px 25px",
                            textAlign: "center",

                          }}
                        >
                          Expiry Date
                        </th>
                        <th
                          style={{
                            padding: "20px",
                            textAlign: "center",

                          }}
                        >
                          Quantity
                        </th>
                      </tr >
                    </thead>
                  </table>
                  <div
                    style={{
                      maxHeight: "200px", // Adjust this value to your needs
                      overflow: "auto",

                    }}
                  >
                    <table
                      className="table-prodetail"
                      style={{ borderCollapse: "collapse", width: "100%", border: "none" }}
                    >
                      <tbody>
                        {proDetails.map((product, index) => (
                          <tr key={index} className="table-row" style={{ borderBottom: "1px solid grey" }}>
                            <td
                              style={{
                                padding: "15px",
                                textAlign: "center",

                              }}
                            >
                              {convertSQLDate(product.production_date)}
                            </td>
                            <td
                              style={{
                                padding: "15px",
                                textAlign: "center",

                              }}
                            >
                              {convertSQLDate(product.expiration_date)}
                            </td>
                            <td
                              style={{
                                padding: "15px",
                                textAlign: "center",

                              }}
                            >
                              {product.quantity}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>


              </Modal >
            )
            }
          </>
        )
      }
    </div >
  );
}
