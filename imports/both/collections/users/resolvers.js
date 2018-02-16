export default {
  Query: {
    me(root, params, context) {
      return context && context.user
    },
  },
}
