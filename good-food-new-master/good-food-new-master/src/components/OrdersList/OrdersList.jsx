import React from 'react';
import "./OrdersList.css";

export default function OrdersList({ ordersList }) {
  return (
    <div className='user-orders__list'>
        {ordersList?.map(order => <div className='user-order__item' key={order.order_id}>
            <h4>{order.name}</h4>
        </div>)}
    </div>
  )
}
