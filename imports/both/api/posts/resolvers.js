import Posts from './'

export default {
  Query: {
    posts(root, params, context) {
      return Posts.find().fetch()
    },
  },

  Mutation: {
    addPost(root, params, context) {
      const { text } = params
      const { userId } = context
      const postId = Posts.insert({ userId, text })
      return Posts.findOne({ _id: postId })
    },
  },
}
