import React from 'react'
import { hydrate } from 'react-dom'
import { onPageLoad } from 'meteor/server-render'

import getClientRoutes from './routes'

onPageLoad(async () => {
  const ClientRoutes = await getClientRoutes()
  hydrate(<ClientRoutes />, document.getElementById('app'))
})
