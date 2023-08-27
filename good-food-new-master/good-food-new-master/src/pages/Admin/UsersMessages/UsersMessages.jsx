import React from 'react';
import "./UsersMessages.css";

export default function UsersMessages({ usersMessages }) {
  return (
    <div className="users-messages__container">
        <h4 className='fw-bold mb-4'>Users Feedback</h4>
        <div className="users-messages__list mt-5">
        {usersMessages && usersMessages.length > 0 && usersMessages.map(message => <div className="list-item" key={message.id}>
        <img width="48" height="48" src="https://img.icons8.com/color/48/new-post.png" alt="new-post"/>
            <h5 className='mt-3 mb-1 text-capitalize fw-bold'>{message.message}</h5>
            <small>sent by - {message.user_name}</small>
            <h6>{message.user_email}</h6>
            <hr className='w-100' />
            <p>{message.message}</p>
        </div>)}
            
        </div>
        {usersMessages.length === 0 && <div className='d-flex align-items-center justify-content-center mt-5 alert alert-secondary'>
            <h5 className='fw-bold'>There is no messages yet</h5>
            </div>}
    </div>
  )
}
