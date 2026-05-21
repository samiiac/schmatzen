import React from "react";
import { Link } from "react-router-dom";

function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <Link to={`/services/${service._id}`}>
        <img style={{height:'260px',width:'100%',objectFit:'cover',display:'block',transition:'transform .3s'}}
          src={service.images?.[0] || ""}
          alt={service.name}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseOut={e => e.currentTarget.style.transform = ''}
        />
      </Link>
      <div className="p-4">
        <Link to={`/services/${service._id}`} style={{textDecoration:'none'}}>
          <h3 style={{fontSize:'1.05rem',color:'var(--text)',marginBottom:'.5rem'}}>{service.name}</h3>
        </Link>
        <div style={{display:'flex',gap:'.85rem',marginBottom:'.4rem'}}>
          <span style={{fontSize:'.82rem',color:'var(--muted)'}}>Basic ₹{service.pricing?.basic}</span>
          <span style={{fontSize:'.82rem',color:'var(--muted)'}}>Premium ₹{service.pricing?.premium}</span>
        </div>
        <p style={{
          fontSize:'.72rem',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:'.75rem',
          color: service.availability ? 'var(--success)' : 'var(--danger)',
          fontWeight: 600,
        }}>
          {service.availability ? '● Available' : '● Unavailable'}
        </p>
        <button
          onClick={() => window.location.href = `/booking/${service._id}`}
          style={{
            width:'100%',padding:'9px',borderRadius:'999px',border:'none',cursor:'pointer',
            background:'linear-gradient(135deg,#e879f9,#f472b6)',
            color:'#fff',fontSize:'.78rem',fontWeight:600,textTransform:'uppercase',
            letterSpacing:'.1em',
            boxShadow:'0 0 20px rgba(232,121,249,.25)',
            transition: 'all .2s',
          }}
          onMouseOver={e => { e.currentTarget.style.boxShadow='0 0 30px rgba(232,121,249,.45)'; e.currentTarget.style.transform='translateY(-1px)'; }}
          onMouseOut={e => { e.currentTarget.style.boxShadow='0 0 20px rgba(232,121,249,.25)'; e.currentTarget.style.transform=''; }}
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default ServiceCard;
