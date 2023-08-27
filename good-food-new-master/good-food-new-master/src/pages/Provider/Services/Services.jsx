import React from 'react';
import "./Services.css";

import SurpriseBag from '../../../components/SurpriseBag/SurpriseBag';

export default function Services({ servicesList }) {
  console.log(servicesList)
  return (
    <div className='provider-services__container'>
        <h4 className='fw-bold mb-4'>Surprise Bags List</h4>
        <div className='provider-services__list'>
            {servicesList?.map(bag => <SurpriseBag key={bag.service_id} {...bag} />)}
        </div>
    </div>
  )
}
