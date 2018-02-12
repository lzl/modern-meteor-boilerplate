import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

const About = () => (
  <div>
    <Helmet>
      <title>About</title>
    </Helmet>
    <h1>About</h1>
    <Link to="/">Home</Link>
  </div>
)

export default About
