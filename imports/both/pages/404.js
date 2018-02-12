import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const NotFound = () => (
  <div>
    <Helmet>
      <title>Not Found</title>
    </Helmet>
    <h1>Not Found</h1>
    <Link to="/">Home</Link>
  </div>
)

export default NotFound
