import React from "react";
import "./AdminHomePage.css";

import { useHttpClient } from "../../../hooks/http-hook";

import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import DataTable from "../../../components/DataTable/DataTable";

export default function AdminHomePage({
  users,
  providers,
  admins,
  fetchAdmins,
  fetchUsers,
}) {

  const { sendRequest } = useHttpClient();

  const deleteAdmin = async (adminId) => {
    try {
      let responseData = await sendRequest(
        `http://localhost:5000/api/admin/delete-admin/${adminId}`,
        "DELETE"
      );

      fetchAdmins();
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "username",
      headerName: "Username",
      width: 120,
    },
    {
      field: "email",
      headerName: "Email",
      width: 120,
    },
    {
      field: "role",
      headerName: "Role",
      width: 90,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <IconButton onClick={() => deleteAdmin(params.row.id)}>
            <DeleteOutlineIcon sx={{ color: "red" }} />
          </IconButton>
        );
      },
    },
  ];

  return (
    <div className="admin-homepage__container">
      <div className="home-page__items">
        <div className="home-page__item">
          <div className="header">
            <i className="bx bx-user me-1 mb-0"></i>
            <h6 className="fw-bold">Number of users</h6>
          </div>
          <h1 className="w-100 text-center">{users?.length}</h1>
        </div>
        <div className="home-page__item">
          <div className="header">
            <i className="bx bx-store-alt me-1"></i>
            <h6 className="fw-bold">Number of stores</h6>
          </div>
          <h1 className="w-100 text-center">{providers?.length}</h1>
        </div>
      </div>
      <div className="row w-100 mt-4">
        <div className="col-xs-12 col-lg-6">
          <div className="table-header mb-3">
            <h5 className="fw-bold">Stores List</h5>
          </div>
          <DataTable data={providers} fetchData={fetchUsers} />
        </div>
        <div className="col-xs-12 col-lg-6">
          <div className="table-header mb-3">
            <h5 className="fw-bold">Users List</h5>
          </div>
          <DataTable data={users} fetchData={fetchUsers} />
        </div>
      </div>
      <div className="row w-100">
        <div className="col-xs-12">
          <div className="table-header mb-3">
            <h5 className="fw-bold">Admins List</h5>
          </div>
          <DataTable data={admins} fetchData={fetchAdmins} cols={columns} />
        </div>
      </div>
    </div>
  );
}
