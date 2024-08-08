import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import DataTable from "react-data-table-component";
import { MdOutlineBlock } from "react-icons/md";
import { CgUnblock } from "react-icons/cg";
import "./UserManagement.scss";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { MainAPI } from "../../API";

export default function UserManagement() {
  const nav = useNavigate();
  const [data, setData] = useState([]);
  const [records, setRecords] = useState(data);
  const [searchQuery, setSearchQuery] = useState("");

  async function fetchData() {
    const token = JSON.parse(localStorage.getItem("accessToken"));
    const response = await axios.get(`${MainAPI}/Admin/all-account`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log(response.data);
    setRecords(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const lockAccount = async (userId) => {
    console.log(userId);
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      await axios.post(
        `${MainAPI}/lock-account`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Account locked successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to lock account");
      console.error(error);
    }
  };

  const unlockAccount = async (userId) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      await axios.post(
        `${MainAPI}/unlock-account`,
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("Account unlocked successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to unlock account");
      console.error(error);
    }
  };

  const handleFilter = records.filter((user) =>
    user.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const column = [
    {
      name: "UserName",
      selector: (row) => row.userName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.roleId,
      sortable: true,
    },
    {
      cell: (row) => (
        <div className="action">
          <span
            className="action-btn"
            onClick={() => lockAccount(row.userId)}
          >
            <MdOutlineBlock color="red" />
          </span>
          <span
            className="action-btn"
            onClick={() => unlockAccount(row.userId)}
          >
            <CgUnblock color="green" />
          </span>
        </div>
      ),
    },
  ];

  return (
    <div className="userManage_container">
      <NavBar />
      <div className="content">
        <ToastContainer autoClose={2000} />
        <h1 className="mt-0">User Management</h1>
        <div className="user_manage mt-4">
          <div className="search">
            <label>Search: </label>
            <input
              id="searchInput"
              type="text"
              placeholder="Search account..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn" onClick={() => nav("/admin/create-staff")}>
            Create Staff
          </button>
        </div>
        <div className="table mt-3">
          <DataTable
            columns={column}
            data={handleFilter}
            selectableRows
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10]}
            className="table-content"
          />
        </div>
      </div>
    </div>
  );
}
