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
    const client = new ApolloClient({
      ssrMode: true,
      link: new SchemaLink({ schema }),
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
  const context = {}
  const cache = await getSSRCache(sink.request.url, context)
  sink.renderIntoElementById('app', cache.html)
  sink.appendToBody(cache.state)
  sink.appendToHead(cache.meta)
  sink.appendToHead(cache.title)
  sink.appendToHead(cache.link)
  sink.appendToHead(cache.styleTags)
})
