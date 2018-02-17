import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

class PostContainer extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
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

const fetchPosts = gql`
  query Query {
    posts {
      _id
      text
      userId
    }
  }
`

const addPost = gql`
  mutation addPost($text: String!) {
    addPost(text: $text) {
      _id
      text
      userId
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
          optimisticResponse: {
            __typename: 'Mutation',
            addPost: {
              __typename: 'Post',
              _id: null,
              text,
              userId: null,
            },
          },
          update: (proxy, { data: { addPost } }) => {
            const data = proxy.readQuery({ query: fetchPosts })
            data.posts.push(addPost)
            proxy.writeQuery({ query: fetchPosts, data })
          },
        }),
    }),
  }),
)(PostContainer)
