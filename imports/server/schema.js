import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash/merge'

import UsersSchema from '/imports/both/api/users/users.graphql'
import UsersResolvers from '/imports/both/api/users/resolvers'
import PostsSchema from '/imports/both/api/posts/posts.graphql'
import PostsResolvers from '/imports/both/api/posts/resolvers'
import ChatsSchema from '/imports/both/api/chats/chats.graphql'
import ChatsResolvers from '/imports/both/api/chats/resolvers'

const typeDefs = [UsersSchema, PostsSchema, ChatsSchema]
const resolvers = merge(UsersResolvers, PostsResolvers, ChatsResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
