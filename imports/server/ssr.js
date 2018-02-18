import { Meteor } from 'meteor/meteor'
import React from 'react'
import { StaticRouter } from 'react-router'
import { onPageLoad } from 'meteor/server-render'
import { Helmet } from 'react-helmet'
import LRU from 'lru-cache'
import { ServerStyleSheet } from 'styled-components'
import { ApolloClient } from 'apollo-client'
import { SchemaLink } from 'apollo-link-schema'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider, renderToStringWithData } from 'react-apollo'
import { generateRoutes } from 'react-code-split-ssr'

import { getUserForContext } from './helpers'
import schema from './schema'
import generateRoutesProps from '/imports/both/routes'

const ssrCache = LRU({
  max: 500,
  maxAge: 1000 * 30,
})

const getSSRCache = async (url, context) => {
  if (ssrCache.has(url.pathname)) {
    return ssrCache.get(url.pathname)
  } else {
    const ServerRoutes = await generateRoutes({
      ...generateRoutesProps,
      pathname: url.pathname,
    })
    const userContext = await getUserForContext(context.loginToken)
    const schemaLink = new SchemaLink({
      schema,
      context: userContext,
    })
    const client = new ApolloClient({
      ssrMode: true,
      link: schemaLink,
      cache: new InMemoryCache(),
    })
    const sheet = new ServerStyleSheet()
    const jsx = sheet.collectStyles(
      <ApolloProvider client={client}>
        <StaticRouter location={url.pathname} context={{}}>
          <ServerRoutes />
        </StaticRouter>
      </ApolloProvider>,
    )
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
