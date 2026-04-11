import React from 'react'

function ServiceCard({service}) {
  return (
   <div>
      <div>
        <h3>{service.name}</h3>
        <img height='100' src={service.images[0]}></img>
        <div>
          <span>Basic : {service.pricing.basic}</span>
          <span>Premium:{service.pricing.premium}</span>
        </div>
        <p>{service.availability?'Available':'Unavailable'}</p>
        <button>Book Now</button>
    </div>
    </div>
  )
}

export default ServiceCard