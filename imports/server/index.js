import { Meteor } from 'meteor/meteor'
import React from 'react'
import { onPageLoad } from 'meteor/server-render'
import { renderToStaticMarkup } from 'react-dom/server'
import { Helmet } from 'react-helmet'
import LRU from 'lru-cache'

import ServerRoutes from './routes'
import './collections'
import './fixtures'

const ssrCache = LRU({
  max: 500,
  maxAge: 1000 * 60 * 60,
})

const getSSRCache = (url, context) => {
  if (ssrCache.has(url.pathname)) {
    return ssrCache.get(url.pathname)
  } else {
    // const htmlStream = renderToStaticNodeStream(<ServerRoutes url={url} context={context} />)
    const htmlString = renderToStaticMarkup(<ServerRoutes url={url} context={context} />)
    const helmet = Helmet.renderStatic()
    const meta = helmet.meta.toString()
    const title = helmet.title.toString()
    const link = helmet.link.toString()
    const newSSRCache = { html: htmlString, meta, title, link }
    Meteor.defer(() => {
      // ssrCache.set(url.pathname, { ...newSSRCache, html: htmlString })
      ssrCache.set(url.pathname, newSSRCache)
    })
    return newSSRCache
  }
}

onPageLoad(sink => {
  const context = {}
  const cache = getSSRCache(sink.request.url, context)
  sink.renderIntoElementById('app', cache.html)
  sink.appendToHead(cache.meta)
  sink.appendToHead(cache.title)
  sink.appendToHead(cache.link)
})
