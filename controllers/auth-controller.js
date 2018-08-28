require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const axios = require('axios')

const login = function(req, res) {
  const { email, password } = req.body
  User.findOne({ email })
  .then(user => {
    let passCheck = bcrypt.compareSync(password, user.password)
    if (!passCheck) {
      return res.status(400).json({
        msg: 'Wrong email / password',
        error: true
      })
    }
    let token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET)
    res.status(201).json({
      msg: 'User logged in',
      token
    })
  })
  .catch(err => {
    res.status(400).json({
      msg: 'Wrong email / password',
      error: err
    })
  })
}

const loginFB = function(req, res) {
  let fbURL = `https://graph.facebook.com/me?fields=id,name,email&access_token=${req.body.fbtoken}`
  axios({
    method: 'get',
    url: fbURL
  })
  .then(({ data }) => {
    User.findOne({ email: data.email })
    .then(user => {
      if (user == null) {
        User.create({
          name: data.name,
          email: data.email,
          password: data.name + '12345'
        })
        .then(newUser => {
          console.log('registered ->', newUser)
          res.status(201).json({
            msg: 'User registered',
            user: newUser
          })
        })
        .catch(err => {
          console.log(err)
          res.status(400).json({
            msg: 'Failed to register',
            error: err
          })
        })
      }
      else {
        let token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET)
        res.status(200).json({
          msg: 'User logged in',
          token
        })
      }
    })
  })
  .catch(err => {
    res.status(400).json({
      msg: 'FB login error',
      error: err
    })
  })
}

const register = function(req, res) {
  const { name, email, password } = req.body
  const hash = bcrypt.hashSync(password, 8)

  User.create({
    name, email, 
    password: hash
  })
  .then(user => {
    res.status(201).json({
      msg: 'User registered',
      user
    })
  })
  .catch(err => {
    res.status(400).json({
      msg: 'Register error',
      error: err
    })
  })
}

module.exports = {
  login, loginFB, register
}