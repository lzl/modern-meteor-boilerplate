import { Meteor } from 'meteor/meteor'
import React from 'react'
import { withTracker } from 'meteor/react-meteor-data'

import Chats from '../../collections/chats'

const ChatContainer = ({ loading, data }) =>
  loading ? <div>loading...</div> : <ChatList chats={data} />

const ChatList = ({ chats }) => <ul>{chats.map(i => <ChatItem key={i._id} item={i} />)}</ul>

const ChatItem = ({ item }) => <li>{item.text}</li>

export default withTracker(() => {
  if (Meteor.isClient) {
    const handle = Meteor.subscribe('chats.list')

    return {
      loading: !handle.ready(),
      data: Chats.find().fetch(),
    }
  } else {
    return {
      loading: true,
    }
  }
})(ChatContainer)
