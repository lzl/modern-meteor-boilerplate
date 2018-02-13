import Posts from './'

export default {
  Query: {
    posts(obj, args, { userId }) {
      return Posts.find().fetch()
    },
  },

  Mutation: {
    createPost(obj, { text }) {
      const postId = Posts.insert({
        text,
      })
      return Posts.findOne(postId)
    },
  },
}
