import { Accounts } from 'meteor/accounts-base'

Accounts.onLogin(() => {
  const loginToken = localStorage.getItem('Meteor.loginToken')
  const expire = localStorage.getItem('Meteor.loginTokenExpires')
  document.cookie = `MeteorLoginToken=${loginToken}; expires=${new Date(
    expire,
  ).toUTCString()}; path=/`
})

Accounts.onLogout(() => {
  document.cookie = 'MeteorLoginToken=; path=/'
})
