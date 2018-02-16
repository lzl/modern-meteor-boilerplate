import { Meteor } from 'meteor/meteor'
import React from 'react'
import { onPageLoad } from 'meteor/server-render'
// import { renderToStaticMarkup } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import LRU from 'lru-cache'
import { ServerStyleSheet } from 'styled-components'
import 'isomorphic-fetch'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SchemaLink } from 'apollo-link-schema'
import { ApolloLink, from } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'

import schema from './schema'
import ServerRoutes from './routes'

const ssrCache = LRU({
  max: 500,
  maxAge: 1000 * 30,
})

const getSSRCache = async (url, context) => {
  if (ssrCache.has(url.pathname)) {
    return ssrCache.get(url.pathname)
  } else {
    const authLink = new ApolloLink((operation, forward) => {
      operation.setContext(() => ({
        headers: {
          'meteor-login-token': context.loginToken,
        },
      }))
      return forward(operation)
    })
    const httpLink = new HttpLink({
      uri: `${Meteor.absoluteUrl()}/graphql`,
      credentials: 'same-origin',
    })

    const client = new ApolloClient({
      ssrMode: true,
      // link: new SchemaLink({ schema }),
      link: from([authLink, httpLink]),
      cache: new InMemoryCache(),
    })
    const sheet = new ServerStyleSheet()
    const jsx = sheet.collectStyles(
      <ApolloProvider client={client}>
        <ServerRoutes url={url} context={context} />
      </ApolloProvider>,
    )
    // const html = renderToStaticMarkup(jsx)
    const html = await renderToStringWithData(jsx)
    const state = `<script>window.__APOLLO_STATE__=${JSON.stringify(client.extract()).replace(
      /</g,
      '\\u003c',
    )}</script>`
    const styleTags = sheet.getStyleTags()
    const helmet = Helmet.renderStatic()
    const meta = helmet.meta.toString()
    const title = helmet.title.toString()
    const link = helmet.link.toString()
    const newSSRCache = { html, state, styleTags, meta, title, link }
    Meteor.defer(() => {
      ssrCache.set(url.pathname, newSSRCache)
    })
    return newSSRCache
  }
}

onPageLoad(async sink => {
  // console.log('cookies:', sink.getCookies())
  // console.log('headers:', sink.getHeaders())
  const cookies = sink.getCookies()
  const context = { loginToken: cookies.MeteorLoginToken }
  const cache = await getSSRCache(sink.request.url, context)
  sink.renderIntoElementById('app', cache.html)
  sink.appendToBody(cache.state)
  sink.appendToHead(cache.meta)
  sink.appendToHead(cache.title)
  sink.appendToHead(cache.link)
  sink.appendToHead(cache.styleTags)
})
