import { Meteor } from 'meteor/meteor'
import React from 'react'
import { onPageLoad } from 'meteor/server-render'
import { renderToStaticMarkup } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import LRU from 'lru-cache'
import { ServerStyleSheet } from 'styled-components'
import 'isomorphic-fetch'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

import ServerRoutes from './routes'

const httpLink = new HttpLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'same-origin',
})

// const cache = new InMemoryCache().restore(window.__APOLLO_STATE__)
const cache = new InMemoryCache()

const client = new ApolloClient({
  ssrMode: Meteor.isServer,
  link: httpLink,
  cache,
})

const ssrCache = LRU({
  max: 500,
  maxAge: 1000 * 60 * 60,
})

const getSSRCache = (url, context) => {
  if (ssrCache.has(url.pathname)) {
    return ssrCache.get(url.pathname)
  } else {
    const sheet = new ServerStyleSheet()
    const jsx = sheet.collectStyles(
      <ApolloProvider client={client}>
        <ServerRoutes url={url} context={context} />
      </ApolloProvider>,
    )
    // const state = `<script>window.__APOLLO_STATE__=${JSON.stringify(cache.extract())};</script>`
    const html = renderToStaticMarkup(jsx)
    const styleTags = sheet.getStyleTags()
    const helmet = Helmet.renderStatic()
    const meta = helmet.meta.toString()
    const title = helmet.title.toString()
    const link = helmet.link.toString()
    const newSSRCache = { html, styleTags, meta, title, link }
    Meteor.defer(() => {
      ssrCache.set(url.pathname, newSSRCache)
    })
    return newSSRCache
  }
}

onPageLoad(sink => {
  const context = {}
  const cache = getSSRCache(sink.request.url, context)
  // sink.appendToBody(cache.state)
  sink.renderIntoElementById('app', cache.html)
  sink.appendToHead(cache.meta)
  sink.appendToHead(cache.title)
  sink.appendToHead(cache.link)
  sink.appendToHead(cache.styleTags)
})
