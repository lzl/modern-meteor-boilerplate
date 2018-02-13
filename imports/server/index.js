import React from 'react'
import { onPageLoad } from 'meteor/server-render'
import { renderToNodeStream } from 'react-dom/server'
import { Helmet } from 'react-helmet'

import ServerRoutes from './routes'
import './collections'
import './fixtures'

onPageLoad(sink => {
  const context = {}

  const html = renderToNodeStream(<ServerRoutes url={sink.request.url} context={context} />)

  sink.renderIntoElementById('app', html)

  const helmet = Helmet.renderStatic()
  sink.appendToHead(helmet.meta.toString())
  sink.appendToHead(helmet.title.toString())
  sink.appendToHead(helmet.link.toString())
})
