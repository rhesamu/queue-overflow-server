require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const axios = require('axios')
const CronJob = require('cron').CronJob
const nodemailer = require('nodemailer')

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
    let transporter = nodemailer.createTransport({
      host: 'smtp@gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'rsvp.hacktiv8@gmail.com', // generated ethereal user
        pass: 'r$vp.hacktiv8' // generated ethereal password
      }
    })

    let mailOptions = {
      from:'"Queue Overflow"',
      to: user.email,
      subject: 'Register successful!',
      html: `<b> Thank you ${user.name},<br>
             you have been registered to Queue Overflow!<br><br>
            </b>`
    }

    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        return res.status(400).json({
          msg: 'Fail to send email',
          error
        })
      } else {
        res.status(201).json({
          msg: 'User registered',
          user
        })
      }
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