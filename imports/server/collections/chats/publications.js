import { Meteor } from 'meteor/meteor'
import { Chats } from '../'

Meteor.publish('chats.list', () => {
  return Chats.find()
})
