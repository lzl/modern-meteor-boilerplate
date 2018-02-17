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
      const postId = Posts.insert({
        text,
      })
      return Posts.findOne(postId)
    },
  },
}
