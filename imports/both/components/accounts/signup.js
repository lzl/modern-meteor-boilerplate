import { Accounts } from 'meteor/accounts-base'
import React, { PureComponent } from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'

class SignupForm extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    const email = this.email.value
    const password = this.password.value
    Accounts.createUser({ email, password }, err => {
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
          <input type="submit" value="Sign up" />
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

export default graphql(fetchMe)(SignupForm)
