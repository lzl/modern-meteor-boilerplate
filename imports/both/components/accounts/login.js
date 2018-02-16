import { Meteor } from 'meteor/meteor'
import React, { PureComponent } from 'react'

class LoginForm extends PureComponent {
  handleSubmit = e => {
    e.preventDefault()
    const email = this.email.value
    const password = this.password.value
    Meteor.loginWithPassword(email, password)
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

export default LoginForm
