import Chats from './'
import pubsub from '/imports/both/pubsub'

export default {
  Query: {
    chats(root, params, context) {
      return Chats.find().fetch()
    },
  },

  Mutation: {
    addChat(root, params, context) {
      const { text } = params
      const chatId = Chats.insert({ text })
      const chat = Chats.findOne({ _id: chatId })
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
