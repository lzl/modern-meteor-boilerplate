import { Meteor } from 'meteor/meteor'
import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class LoginForm extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    const email = this.email.value
    const password = this.password.value
    Meteor.loginWithPassword(email, password, err => {
      if (err) return
      this.props.data.refetch()
    })
    this.form.reset()
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit} ref={el => (this.form = el)}>
          <input type="email" placeholder="Email" ref={el => (this.email = el)} />
          <input type="password" placeholder="Password" ref={el => (this.password = el)} />
          <input type="submit" value="Login" />
        </form>
      </div>
    )
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

export default graphql(fetchMe)(LoginForm)
