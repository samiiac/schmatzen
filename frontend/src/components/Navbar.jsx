import React from 'react'
import {Link} from 'react-router-dom'

function Navbar() {
  return (
    <div>
      <div>
          <Link to='/'>Schatzen</Link>
          <Link to='/services'>Explore</Link >
      </div>
    </div>
  )
}

export default Navbar