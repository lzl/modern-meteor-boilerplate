import React, { PureComponent } from 'react'

import callWithPromise from '/imports/both/helpers/call-with-promise'

class PostContainer extends PureComponent {
  state = { loading: true, data: [] }

  async componentDidMount() {
    const data = await callWithPromise('posts.list')
    this.setState({ data, loading: false })
  }

  render() {
    const { loading, data } = this.state
    return loading ? <div>loading...</div> : <PostList posts={data} />
  }
}

const PostList = ({ posts }) => <ul>{posts.map(i => <PostItem key={i._id} item={i} />)}</ul>

const PostItem = ({ item }) => <li>{item.text}</li>

export default PostContainer
