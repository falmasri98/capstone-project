import React from 'react';
import "./Orders.css";

import { useHttpClient } from '../../../hooks/http-hook';

import IconButton from "@mui/material/IconButton";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import Table from "../../../UI/Table";

export default function Orders({ orders, fetchProviderOrders }) {

  const { sendRequest } = useHttpClient();

  const deleteOrder = async (orderId) => {
    try {
      let responseData = await sendRequest(
        `http://localhost:5000/api/users/delete-order/${orderId}`,
        "DELETE"
      );
      
      if(responseData) fetchProviderOrders();
    } catch (err) {
      console.log(err);
    }
  };

  const confirmOrder = async (orderId) => {
    try {
      let responseData = await sendRequest(
        `http://localhost:5000/api/users/confirm-order/${orderId}`,
        "PATCH"
      );
      
      if(responseData) fetchProviderOrders();
      window.open('mailto:test@example.com?subject=subject&body=body');
    } catch (err) {
      console.log(err);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      width: 90,
    },
    {
      field: "order_date",
      headerName: "order Date",
      width: 210,
    },
    {
      field: "username",
      headerName: "Ordered By",
      width: 150,
    },
    {
      field: "service_type",
      headerName: "Bag Type",
      width: 120,
    },
    {
      field: "service_category",
      headerName: "Bag Category",
      width: 120,
    },
    {
      field: "order_status",
      headerName: "Order Status",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: (params) => {
        return (
          <>
          <IconButton onClick={() => deleteOrder(params.row.id)}>
            <DeleteOutlineIcon sx={{ color: "red" }} />
          </IconButton>
          {params.row.order_status !== 'confirmed' && <IconButton onClick={() => confirmOrder(params.row.id)}>
            <CheckCircleIcon sx={{ color: "green" }} />
          </IconButton>}
        </>
        );
      },
    },
  ];

  return (
    <div className='provider-orders__container'>
      <h5 className='fw-bold mb-4'>Customers Orders</h5>
      <Table rows={orders} cols={columns} />
    </div>
  )
}
