import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

const Me = ({ data: { loading, me } }) => {
  if (loading) return <div>loading...</div>
  const email = me && me.emails && me.emails[0] && me.emails[0].address
  if (email) {
    return (
      <div>
        {email} ({me._id})
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

export default graphql(fetchMe)(Me)
