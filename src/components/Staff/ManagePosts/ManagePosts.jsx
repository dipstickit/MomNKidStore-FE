import React, { useEffect, useState } from "react";
import axios from "axios";
import { MainAPI } from "../../API";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useAuth from "../../../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import { DeleteIcon } from "../../../utils/Icon/DeleteIcon";
import { MdModeEdit } from "react-icons/md";
import "./ManagePost.scss";
import { convertSQLDate } from "../../../utils/Format";
import { Button, Modal } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

export default function ManagePosts() {
  // console.log(description);
  const { auth } = useAuth();
  const nav = useNavigate();
  const [records, setRecords] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchData = () => {
    axios
      .get(`${MainAPI}/user/show-all-posts`)
      .then((res) => {
        console.log(res.data);
        setRecords(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (id) => {
    axios
      .delete(`${MainAPI}/staff/delete-post/${id}`, {
        headers: {
          "x-access-token": JSON.parse(localStorage.getItem("accessToken")),
        },
      })
      .then((res) => {
        console.log(res.data);
        toast.success(res.data.message);
        fetchData();
        localStorage.removeItem("post_id");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const column = [
    {
      name: "Post Id",
      selector: (row) => row.post_id,
      sortable: true,
      center: true,
    },
    {
      name: "Post Title",
      selector: (row) => row.title,
      sortable: true,
      center: true,
    },
    {
      name: "Post date",
      selector: (row) => convertSQLDate(row.post_date),
      sortable: true,
      center: true,
    },
    {
      cell: (row) => (
        <div className="action">
          <span
            className="action-btn"
            onClick={() => {
              // handleDelete(row.post_id);
              handleShow();
              localStorage.setItem("post_id", row.post_id);
            }}
          >
            <DeleteIcon color="red" />
          </span>
          <Link className="action-btn" to={`/staff/edit-post/${row.post_id}`}>
            <MdModeEdit color="green" />
          </Link>
        </div>
      ),
      center: true,
    },
  ];

  return (
    <>
      {
        loading ? (
          <>
            <div className=" spinner-post">
              <Spinner animation="border" role="status" />
            </div>
          </>
        ) : (
          <div className="manage-post-container">
            <ToastContainer autoClose={2000} />

            <Link to={"/staff/create-post"} className="create-post-btn">
              Thêm bài
            </Link>

            <div className="table-post mt-3">
              <DataTable
                pagination
                paginationPerPage={5}
                paginationRowsPerPageOptions={[5, 8]}
                columns={column}
                data={records}
                className="table-content"
              />
            </div>

            <div className="modal-content">
              <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                  <Modal.Title>Remove post</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you want to remove this post?</Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      handleClose();
                      localStorage.removeItem("post_id");
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      handleClose();
                      handleDelete(localStorage.getItem("post_id"));
                    }}
                  >
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
        )
      }
    </>
  );
}
