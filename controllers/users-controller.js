const User = require('../models/User')

const getUserInfo = function(req, res) {
  const userId = req.user.userId
  User.findById(userId)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(err => {
    res.status(400).json({
      msg: 'get user info error',
      error: err
    })
  })
}

module.exports = {
  getUserInfo
}