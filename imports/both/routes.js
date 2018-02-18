import React from 'react'
import { Bundle } from 'react-code-split-ssr'

const NotFound = () => <Bundle mod={import('./pages/404')} />
const Index = () => <Bundle mod={import('./pages/index')} />
const About = () => <Bundle mod={import('./pages/about')} />

const routes = [
  { exact: true, path: '/', component: Index },
  { exact: true, path: '/about', component: About },
]

const redirects = [{ from: '/test', to: '/' }]

const notFoundComp = NotFound

export { routes, redirects, notFoundComp }
