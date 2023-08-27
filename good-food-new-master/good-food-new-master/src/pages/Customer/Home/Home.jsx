import React from 'react';
import "./Home.css";

import Table from '../../../UI/Table'; 

export default function Home({ userOrders, fetchUserOrders }) {
  return (
    <div className='user-home__container'>
        <h4 className='fw-bold mb-4'>My Orders List</h4>
        <Table rows={userOrders} fetchData={fetchUserOrders} />
    </div>
  )
}
