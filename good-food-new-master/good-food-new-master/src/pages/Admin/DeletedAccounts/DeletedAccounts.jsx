import React from 'react';
import "./DeletedAccounts.css";

import DataTable from '../../../components/DataTable/DataTable';
import Table from '../../../UI/Table';

export default function DeletedAccounts({ deletedAccounts }) {

  const columns = [
    {
      field: "id",
      headerName: "User ID",
      width: 120,
    },
    {
      field: "username",
      headerName: "User Name",
      width: 120,
    },
    {
      field: "email",
      headerName: "Email",
      width: 150,
    },
    {
      field: "phonenumber",
      headerName: "Phone Number",
      width: 120,
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
    },
  ];

  return (
    <div className='deleted-accounts__container'>
      <h4 className='fw-bold mb-5'>Deleted Accounts</h4>
      {/* {deletedAccounts && deletedAccounts.length > 0 && <DataTable data={deletedAccounts} deletedAccounts />} */}
      <Table cols={columns} rows={deletedAccounts} />
      {deletedAccounts?.length === 0 && <h3 className='w-100 text-center fw-bold'>There is no data to show</h3>}
    </div>
  )
}
