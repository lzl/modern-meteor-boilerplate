import { Accounts } from 'meteor/accounts-base'
import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { onPageLoad } from 'meteor/server-render'
import { ApolloLink, from, split } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { DDPSubscriptionLink, isSubscription } from 'meteor/swydo:ddp-apollo'
import { ApolloProvider } from 'react-apollo'
import { generateRoutes } from 'react-code-split-ssr'

import generateRoutesProps from '/imports/both/routes'
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

const ddpLink = new DDPSubscriptionLink()

const client = new ApolloClient({
  link: split(isSubscription, ddpLink, from([authLink, httpLink])),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
  connectToDevTools: Meteor.isDevelopment,
})

onPageLoad(async () => {
  const ClientRoutes = await generateRoutes({
    ...generateRoutesProps,
    pathname: window.location.pathname,
  })
  hydrate(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <ClientRoutes />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('app'),
  )
})
