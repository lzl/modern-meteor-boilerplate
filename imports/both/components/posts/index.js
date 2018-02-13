import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { graphql, withApollo } from 'react-apollo'

import callWithPromise from '/imports/both/helpers/call-with-promise'

// class PostContainer extends PureComponent {
//   state = { loading: true, data: [] }
//
//   async componentDidMount() {
//     const data = await callWithPromise('posts.list')
//     this.setState({ data, loading: false })
//   }
//
//   render() {
//     const { loading, data } = this.state
//     return loading ? <div>loading...</div> : <PostList posts={data} />
//   }
// }

const PostContainer = ({ loading, posts }) =>
  loading ? <div>loading...</div> : <PostList posts={posts} />

const PostList = ({ posts }) => <ul>{posts.map(i => <PostItem key={i._id} item={i} />)}</ul>

const PostItem = ({ item }) => <li>{item.text}</li>

// export default PostContainer

const postsQuery = gql`
  query Query {
    posts {
      _id
      text
    }
  }
`

export default graphql(postsQuery, {
  props: ({ data }) => ({ ...data }),
})(withApollo(PostContainer))
