import React from 'react'
import { hydrate } from 'react-dom'
import { onPageLoad } from 'meteor/server-render'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink, from } from 'apollo-link'
import { ApolloClient, split } from 'apollo-client-preset'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
// import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { DDPLink, DDPSubscriptionLink, isSubscription } from 'meteor/swydo:ddp-apollo'
import { Accounts } from 'meteor/accounts-base'

import getClientRoutes from './routes'
import './accounts-config'

const authLink = new ApolloLink((operation, forward) => {
  const token = Accounts._storedLoginToken()
  operation.setContext(() => ({
    headers: {
      'meteor-login-token': token,
    },
  }))
  return forward(operation)
})

const httpLink = new HttpLink()

// const wsLink = new WebSocketLink({
//   uri: 'ws://127.0.0.1:3000/graphql',
//   options: {
//     reconnect: true,
//   },
// })

const ddpLink = new DDPSubscriptionLink()

// const link = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query)
//     return kind === 'OperationDefinition' && operation === 'subscription'
//   },
//   ddpLink,
//   concat(authLink, httpLink),
// )

const link = split(isSubscription, ddpLink, from([authLink, httpLink]))

const client = new ApolloClient({
  link,
  // link: new DDPLink(),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  // connectToDevTools: Meteor.isDevelopment,
  connectToDevTools: true,
})

onPageLoad(async () => {
  const ClientRoutes = await getClientRoutes()
  hydrate(
    <ApolloProvider client={client}>
      <ClientRoutes />
    </ApolloProvider>,
    document.getElementById('app'),
  )
})
