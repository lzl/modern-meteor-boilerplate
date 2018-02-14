import Chats from './'

export default {
  Query: {
    chats(obj, args) {
      return Chats.find().fetch()
    },
  },

  Mutation: {
    createChat(obj, { text }) {
      const chatId = Chats.insert({
        text,
      })
      return Chats.findOne(chatId)
    },
  },
}
