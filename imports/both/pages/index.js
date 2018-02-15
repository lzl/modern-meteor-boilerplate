import React from 'react'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router-dom'

import PostList from '../components/posts'
import ChatList from '../components/chats'

const Home = () => (
  <div>
    <Helmet>
      <title>Home</title>
    </Helmet>
    <h1>Home</h1>
    <Link to="/about">About</Link>
    <hr />
    <h2>Posts</h2>
    <PostList />
    <hr />
    <h2>Chats</h2>
    <ChatList />
  </div>
)

export default Home
