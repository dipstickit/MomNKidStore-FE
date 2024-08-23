import React, { useEffect, useState } from "react";
import NavBar from "../NavBar/NavBar";
import DataTable from "react-data-table-component";
import { MdOutlineRemoveCircleOutline } from "react-icons/md";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("");

  const fetchData = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const response = await axios.get(`${MainAPI}/Admin/all-account`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Đảm bảo rằng response.data bao gồm trạng thái ban/unban
      const updatedData = response.data.map(user => ({
        ...user,
        isLocked: user.isLocked,  // giả sử server trả về isLocked
      }));

      setData(updatedData);
    } catch (error) {
      toast.error("Failed to fetch user data");
      console.error("Fetch data error:", error);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const toggleAccountStatus = async (accountId, isLocked = false) => {
    try {
      const token = JSON.parse(localStorage.getItem("accessToken"));
      const url = isLocked
        ? `${MainAPI}/unlock-account?accountId=${accountId}`
        : `${MainAPI}/lock-account?accountId=${accountId}`;

      await axios.post(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setData(prevData =>
        prevData.map(user =>
          user.accountId === accountId ? { ...user, isLocked: !isLocked } : user
        )
      );

      toast.success(isLocked ? "Account unlocked successfully" : "Account locked successfully");
    } catch (error) {
      toast.error(isLocked ? "Failed to unlock account" : "Failed to lock account");
      console.error("Toggle account status error:", error);
    }
  };




  const filteredData = data.filter((user) => {
    const matchesSearchQuery = user.userName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRoleFilter = selectedRole ? user.roleId === parseInt(selectedRole) : true;
    return matchesSearchQuery && matchesRoleFilter;
  });

  const getRoleName = (roleId) => {
    switch (roleId) {
      // case 1:
      //   return "Admin";
      case 2:
        return "Staff";
      case 3:
        return "Customer";
      case 4:
        return "Delivery";
      default:
        return "Unknown";
    }
  };

  const columns = [
    {
      name: "ID",
      selector: (row) => row.accountId,
      sortable: true,
    },
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
      selector: (row) => getRoleName(row.roleId),
      sortable: true,
    },
    {
      name: "Status",
      cell: (row) => {
        const isLocked = row.isLocked !== undefined ? row.isLocked : false;

        return (
          <div className="action">
            <span
              className={`action-btn ${isLocked ? 'unlock-btn' : 'lock-btn'}`}
              title={isLocked ? "Unban Account" : "Ban Account"}
              onClick={(e) => { e.preventDefault(); toggleAccountStatus(row.accountId, isLocked) }}
            >
              {isLocked ? <CgUnblock /> : <MdOutlineRemoveCircleOutline />}
            </span>
          </div>
        );
      },
    },
  ];


  return (
    <div className="userManage_container">
      <ToastContainer />
      <NavBar />
      <div className="content">
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
          <div className="role-filter">
            <label>Filter by Role: </label>
            <select
              id="roleFilter"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">All Roles</option>
              {/* <option value="1">Admin</option> */}
              <option value="2">Staff</option>
              <option value="3">Customer</option>
              <option value="4">Delivery</option>
            </select>
          </div>
          <button className="btn" onClick={() => nav("/admin/create-staff")}>
            Create Staff & Delivery
          </button>
        </div>
        <div className="table mt-3">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            paginationPerPage={8}
            paginationRowsPerPageOptions={[8, 16, 24, 32, 40, 48, 56, 64, 72]}
          />
        </div>
      </div>
    </div>
  );
}
