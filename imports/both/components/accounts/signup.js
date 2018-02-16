import { Accounts } from 'meteor/accounts-base'
import React, { PureComponent } from 'react'

class SignupForm extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    const email = this.email.value
    const password = this.password.value
    Accounts.createUser({ email, password })
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

export default SignupForm
