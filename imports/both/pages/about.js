import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import Me from '../components/accounts/me'
import SignupForm from '../components/accounts/signup'
import LoginForm from '../components/accounts/login'

const About = () => (
  <Wrapper>
    <Helmet>
      <title>About</title>
    </Helmet>
    <h1>About</h1>
    <Link to="/">Home</Link>
    <hr />
    <Me />
    <SignupForm />
    <LoginForm />
  </Wrapper>
)

const Wrapper = styled.div`
  color: #111111;
`

export default About
