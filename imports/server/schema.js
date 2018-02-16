import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash/merge'

import PostsSchema from '/imports/both/collections/posts/posts.graphql'
import PostsResolvers from '/imports/both/collections/posts/resolvers'
import ChatsSchema from '/imports/both/collections/chats/chats.graphql'
import ChatsResolvers from '/imports/both/collections/chats/resolvers'
import UsersSchema from '/imports/both/collections/users/users.graphql'
import UsersResolvers from '/imports/both/collections/users/resolvers'

const typeDefs = [PostsSchema, ChatsSchema, UsersSchema]
const resolvers = merge(PostsResolvers, ChatsResolvers, UsersResolvers)

export default makeExecutableSchema({
  typeDefs,
  resolvers,
})
