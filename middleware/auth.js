require('dotenv').config()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

const isAuthenticated = function(req, res, next) {
  const { token } = req.headers
  if (token) {
    try {
      let decoded = jwt.verify(token, process.env.JWT_SECRET)
      User.findOne({
        _id: decoded.userId,
        email: decoded.email
      })
      .then(user => {
        if (user) {
          req['user'] = decoded
          next()
        } 
        else {
          res.status(400).json({
            msg: 'User not found',
            error: true
          })
        }
      })
    } catch (error) {
      res.status(400).json({
        msg: 'User token not valid',
        error
      })
    }
  } else {
    res.status(400).json({
      msg: 'You have to log in first',
      error: true
    })
  }
}

module.exports = { isAuthenticated }