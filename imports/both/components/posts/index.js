import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import { Random } from 'meteor/random'

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

class PostContainer extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    // this.props.updateQuery(previousResult => ({
    //   ...previousResult,
    //   posts: [
    //     ...previousResult.posts,
    //     { _id: Random.id(), text: this.input.value, __typename: 'Post' },
    //   ],
    // }))
    this.props.addPost({ text: this.input.value })
    this.form.reset()
  }

  render() {
    const { data: { loading, posts } } = this.props

    if (loading) return <div>loading...</div>

    return (
      <div>
        <PostList posts={posts} />
        <form onSubmit={this.handleSubmit} ref={el => (this.form = el)}>
          <input type="text" ref={el => (this.input = el)} />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

const PostList = ({ posts }) => <ul>{posts.map(i => <PostItem key={i._id} item={i} />)}</ul>

const PostItem = ({ item }) => <li>{item.text}</li>

// export default PostContainer

const fetchPosts = gql`
  query Query {
    posts {
      _id
      text
    }
  }
`

const addPost = gql`
  mutation addPost($text: String!) {
    addPost(text: $text) {
      _id
      text
    }
  }
`

export default compose(
  graphql(fetchPosts),
  graphql(addPost, {
    props: ({ ownProps, mutate }) => ({
      addPost: ({ text }) =>
        mutate({
          mutation: addPost,
          variables: { text },
          update: (proxy, { data: { addPost } }) => {
            const data = proxy.readQuery({ query: fetchPosts })
            data.posts.push(addPost)
            proxy.writeQuery({ query: fetchPosts, data })
          },
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              text,
              _id: Random.id(),
            },
          },
        }),
    }),
  }),
)(PostContainer)
