import React from 'react';
import "./AddedServices.css";
import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useHttpClient } from '../../../hooks/http-hook';
import Table from "../../../UI/Table";

export default function AddedServices({ allServices, fetchAllServices }) {

    const { sendRequest } = useHttpClient();

    const deleteService = async (serviceId, email) => {
        let subject = "Service Canecled.";
        let body = "Service has been canceled.";

        try {
          let responseData = await sendRequest(
            `http://localhost:5000/api/admin/delete-service/${serviceId}`,
            "DELETE"
          );
          
          if(responseData) fetchAllServices();
          window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        } catch (err) {
          console.log(err);
        }
      };

    const confirmService = async (serviceId, email) => {
        let subject = "Service confirmed.";
        let body = "Service has been confirmed.";

        try {
          let responseData = await sendRequest(
            `http://localhost:5000/api/admin/confirm-service/${serviceId}`,
            "PATCH"
          );
          
          if(responseData) fetchAllServices();
          window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        } catch (err) {
          console.log(err);
        }
      };

    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "username",
            headerName: "Created By",
            width: 90,
          },
          {
            field: "email",
            headerName: "Email",
            width: 120,
          },
        {
          field: "service_type",
          headerName: "Service Type",
          width: 120,
        },
        {
          field: "service_category",
          headerName: "Service Category",
          width: 120,
        },
        {
          field: "status",
          headerName: "Status",
          width: 90,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 150,
            renderCell: (params) => {
              return (
                <>
                <IconButton onClick={() => deleteService(params.row.id, params.row.email)}>
                  <DeleteOutlineIcon sx={{ color: "red" }} />
                </IconButton>
                {params.row.status !== 'confirmed' && <IconButton onClick={() => confirmService(params.row.id, params.row.email)}>
                  <CheckCircleIcon sx={{ color: "green" }} />
                </IconButton>}
              </>
              );
            },
          },
      ];

  return (
    <div className='added-services__container'>
        <h4 className='fw-bold'>All Services</h4>
        <Table cols={columns} rows={allServices} />
    </div>
  )
}
