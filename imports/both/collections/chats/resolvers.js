import Chats from './'

export default {
  Query: {
    chats(obj, args, { userId }) {
      return Chats.find().fetch()
    },
  },

  Mutation: {
    createPost(obj, { text }) {
      const chatId = Chats.insert({
        text,
      })
      return Chats.findOne(chatId)
    },
  },
}
