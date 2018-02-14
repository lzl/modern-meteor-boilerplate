import { createApolloServer } from 'meteor/apollo'

import schema from './schema'

createApolloServer({ schema })
