import React from 'react'
import gql from 'graphql-tag'
import { graphql, withApollo } from 'react-apollo'

const logout = client => Meteor.logout(() => client.resetStore())

const Me = ({ data: { loading, me }, client }) => {
  if (loading) return <div>loading...</div>
  const email = me && me.emails && me.emails[0] && me.emails[0].address
  if (email) {
    return (
      <div>
        {email} ({me._id}) <button onClick={() => logout(client)}>Logout</button>
      </div>
    )
  } else {
    return null
  }
}

const fetchMe = gql`
  query Query {
    me {
      _id
      emails {
        address
      }
    }
  }
`

export default graphql(fetchMe)(withApollo(Me))
