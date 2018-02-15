import { WebApp } from 'meteor/webapp'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import cors from 'cors'

import schema from './schema'

new SubscriptionServer(
  {
    schema,
    execute,
    subscribe,
  },
  {
    server: WebApp.httpServer,
    path: '/graphql',
    configServer: expressServer => expressServer.use(cors()),
  },
)
