import React from 'react'
import { BrowserRouter, matchPath, Redirect, Route, Switch } from 'react-router-dom'

import Bundle from './bundle'

const NotFound = () => <Bundle mod={import('/imports/both/pages/404').then(m => m.default)} />
const Index = () => <Bundle mod={import('/imports/both/pages/index').then(m => m.default)} />
const About = () => <Bundle mod={import('/imports/both/pages/about').then(m => m.default)} />

export default async () => {
  const routes = [
    { exact: true, path: '/', component: Index },
    { exact: true, path: '/about', component: About },
  ]
  const redirects = []

  const preload = routes.find(
    route =>
      !!matchPath(window.location.pathname, {
        path: route.path,
        exact: true,
        strict: true,
      }),
  )
  const preloadedComp = preload ? await preload.component().props.mod : await NotFound().props.mod
  const renderComp = (path, bundle) => {
    if (!preloadedComp) return bundle
    const isSSR = (preload && preload.path === path) || (!preload && !path)
    return isSSR ? preloadedComp : bundle
  }

  return () => (
    <BrowserRouter>
      <Switch>
        {routes.map((props, i) => (
          <Route key={i} {...props} component={renderComp(props.path, props.component)} />
        ))}
        {redirects.map((props, i) => <Redirect key={i} {...props} />)}
        <Route component={renderComp(null, NotFound)} />
      </Switch>
    </BrowserRouter>
  )
}
