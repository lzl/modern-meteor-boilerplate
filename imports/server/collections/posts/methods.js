import { Meteor } from 'meteor/meteor'
import { Posts } from '../'

Meteor.methods({
  'posts.list'() {
    return Posts.find().fetch()
  },
})
