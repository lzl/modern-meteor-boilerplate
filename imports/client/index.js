import React from 'react'
import { hydrate } from 'react-dom'
import { onPageLoad } from 'meteor/server-render'
import { ApolloProvider } from 'react-apollo'
// import { ApolloLink, from } from 'apollo-link'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import getClientRoutes from './routes'

const httpLink = new HttpLink()

// const authLink = new ApolloLink((operation, forward) => {
//   const token = Accounts._storedLoginToken()
//   operation.setContext(() => ({
//     headers: {
//       'meteor-login-token': token,
//     },
//   }))
//   return forward(operation)
// })

const cache = new InMemoryCache().restore(window.__APOLLO_STATE__)

const client = new ApolloClient({
  link: httpLink,
  cache,
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
