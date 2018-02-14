import Posts from './'

export default {
  Query: {
    posts(obj, args) {
      return Posts.find().fetch()
    },
  },

  Mutation: {
    addPost(obj, { text }) {
      const postId = Posts.insert({
        text,
      })
      return Posts.findOne(postId)
    },
  },
}
