import { Meteor } from 'meteor/meteor'
import { Promise } from 'meteor/promise'

const callWithPromise = (method, params) => {
  const methodPromise = new Promise((resolve, reject) => {
    Meteor.call(method, params, (error, result) => {
      if (error) reject(error)
      resolve(result)
    })
  })
  return methodPromise
}

export default callWithPromise
