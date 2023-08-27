import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useHttpClient } from "../hooks/http-hook";

export default function Table({ rows, fetchData, cols }) {
  const { sendRequest } = useHttpClient();

  const deleteOrder = async (orderId) => {
    try {
      let responseData = await sendRequest(
        `http://localhost:5000/api/users/delete-order/${orderId}`,
        "DELETE"
      );

      fetchData();
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
          <IconButton onClick={() => deleteOrder(params.row.id)}>
            <DeleteOutlineIcon sx={{ color: "red" }} />
          </IconButton>
        );
      },
    },
  ];

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={cols || columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>
  );
}
