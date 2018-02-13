import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools'
import merge from 'lodash/merge'

import PostsSchema from '/imports/both/collections/posts/posts.graphql'
import PostsResolvers from '/imports/both/collections/posts/resolvers'
import ChatsSchema from '/imports/both/collections/chats/chats.graphql'
import ChatsResolvers from '/imports/both/collections/chats/resolvers'

const typeDefs = [PostsSchema, ChatsSchema]

const resolvers = merge(PostsResolvers, ChatsResolvers)

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

createApolloServer({ schema })
