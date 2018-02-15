import Chats from './'
import pubsub from '/imports/both/pubsub'

export default {
  Query: {
    chats(obj, args) {
      return Chats.find().fetch()
    },
  },

  Mutation: {
    addChat(obj, { text }) {
      const chatId = Chats.insert({
        text,
      })
      const chat = Chats.findOne(chatId)
      pubsub.publish('chatAdded', { chatAdded: chat })
      return chat
    },
  },

  Subscription: {
    chatAdded: {
      subscribe: () => pubsub.asyncIterator('chatAdded'),
    },
  },
}
