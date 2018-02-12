import { Meteor } from 'meteor/meteor'
import React from 'react'
import { hydrate } from 'react-dom'

import getClientRoutes from './routes'

Meteor.startup(async () => {
  const ClientRoutes = await getClientRoutes()
  hydrate(<ClientRoutes />, document.getElementById('app'))
})
