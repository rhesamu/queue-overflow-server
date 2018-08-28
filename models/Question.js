const mongoose = require('mongoose')
const Schema = mongoose.Schema

let questionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String
  },
  question: {
    type: String
  },
  tags: [{
    type: String
  }],
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
})

const question = mongoose.model('Question', questionSchema)
module.exports = question