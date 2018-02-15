// import { Meteor } from 'meteor/meteor'
import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
// import { withTracker } from 'meteor/react-meteor-data'

// import Chats from '../../collections/chats'

const chatSubscription = gql`
  subscription chatAdded {
    chatAdded {
      _id
      text
    }
  }
`

class ChatContainer extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    // this.props.updateQuery(previousResult => ({
    //   ...previousResult,
    //   posts: [
    //     ...previousResult.posts,
    //     { _id: Random.id(), text: this.input.value, __typename: 'Post' },
    //   ],
    // }))
    this.props.addChat({ text: this.input.value })
    this.form.reset()
  }

  componentDidMount() {
    this.props.data.subscribeToMore({
      document: chatSubscription,
      updateQuery: (prev, { subscriptionData }) => {
        const newChat = subscriptionData.data.chatAdded
        if (prev.chats.find(i => i._id === newChat._id)) {
          return prev
        }
        return {
          ...prev,
          chats: [...prev.chats.filter(i => i._id !== null), newChat],
        }
      },
    })
  }

  render() {
    const { data: { loading, chats } } = this.props

    if (loading) return <div>loading...</div>

    return (
      <div>
        <ChatList chats={chats} />
        <form onSubmit={this.handleSubmit} ref={el => (this.form = el)}>
          <input type="text" ref={el => (this.input = el)} />
          <input type="submit" />
        </form>
      </div>
    )
  }
}

const ChatList = ({ chats }) => <ul>{chats.map(i => <ChatItem key={i._id} item={i} />)}</ul>

const ChatItem = ({ item }) => <li>{item.text}</li>

const fetchChats = gql`
  query Query {
    chats {
      _id
      text
    }
  }
`

const addChat = gql`
  mutation addChat($text: String!) {
    addChat(text: $text) {
      _id
      text
    }
  }
`

export default compose(
  graphql(fetchChats),
  graphql(addChat, {
    props: ({ ownProps, mutate }) => ({
      addChat: ({ text }) =>
        mutate({
          mutation: addChat,
          variables: { text },
          optimisticResponse: {
            __typename: 'Mutation',
            addChat: {
              __typename: 'Chat',
              _id: null,
              text,
            },
          },
          // optimisticResponse: {
          //   __typename: 'Post',
          //   _id: Random.id(),
          //   text,
          // },
          update: (proxy, { data: { addChat } }) => {
            const data = proxy.readQuery({ query: fetchChats })
            // don't double add the chat
            if (!data.chats.find(i => i._id === addChat._id)) {
              data.chats.push(addChat)
            }
            proxy.writeQuery({ query: fetchChats, data })
          },
        }),
    }),
  }),
)(ChatContainer)

// export default withTracker(() => {
//   if (Meteor.isClient) {
//     const handle = Meteor.subscribe('chats.list')
//
//     return {
//       loading: !handle.ready(),
//       data: Chats.find().fetch(),
//     }
//   } else {
//     return {
//       loading: true,
//     }
//   }
// })(ChatContainer)
