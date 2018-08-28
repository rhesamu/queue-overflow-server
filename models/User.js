const mongoose = require('mongoose')
const Schema = mongoose.Schema

let userSchema = new Schema({
  name: {
    type: String,
    required: 'Name is required'
  },
  email: {
    type: String,
    required: 'Email is required',
    unique: [true, 'Email already exists'],
    validate: {
      validator: function(value) {
        let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return regex.test(value)
      }
    }
  },
  password: {
    type: String,
    required: 'Password is required',
    minLength: 6
  },
  fbid: String
})

const User = mongoose.model('User', userSchema)
module.exports = User