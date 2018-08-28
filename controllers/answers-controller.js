const Answer = require('../models/Answer')

const create = function(req, res) {
  const { answer, questionId } = req.body
  const { userId } = req.user

  Answer.create({
    userId, questionId, answer
  })
  .then(newAnswer => {
    console.log(newAnswer)
    res.status(201).json(newAnswer)
  })
  .catch(err => {
    console.log(err)
    res.status(400).json({
      msg: 'Create answer error',
      error: err
    })
  })
}

const update = function(req, res) {
  const { answerId } = req.params
  const { answer } = req.body

  Answer.findOneAndUpdate({
    _id: answerId
  }, {
    answer: answer
  })
  .then(updated => {
    res.status(200).json(updated)
  })
  .catch(err => {
    res.status(400).json({
      msg: 'update answer error',
      error: err
    })
  })
}

const getAll = function(req, res) {
  const { questionId } = req.body

  Answer.find({ questionId })
  .populate('userId', 'name')
  .then(answers => {
    res.status(200).json(answers)
  })
  .catch(err => {
    res.status(400).json({
      msg: 'get answers error',
      error: err
    })
  })
}

const upVote = function(req, res) {
  // let { questionId } = req.body
  let { answerId } = req.params
  let { userId } = req.user

  Answer.findById(answerId)
  .then(answer => {
    // if current user is the author
    if (userId == answer.userId._id) {
      return res.status(400).json({
        msg: 'You cannot vote',
        error: true
      })
    }
    // console.log(question)
    let upvotes = answer.upvotes
    let downvotes = answer.downvotes
    console.log('upvote & downvote state', upvotes, downvotes)
    // check if user already upvoted
    for (let i = 0; i < upvotes.length; i++) {
      if (upvotes[i] == userId) {
        return res.status(400).json({
          msg: 'You cannot upvote anymore',
          error: true
        })
      }
    }
    // if yes, check if he already downvoted, then delete the userId from downvotes array
    for (let i = 0; i < downvotes.length; i++) {
      if (downvotes[i] == userId) {
        downvotes.splice(i, 1)
        break
      }
    }

    Answer.findOneAndUpdate(
      { _id: answerId },
      { 
        $push: { upvotes: userId },
        downvotes: downvotes
      },
      { new: true }
    )
    .then(updated => {
      console.log('updated data ->',updated)
      let total = updated.upvotes.length - updated.downvotes.length
      res.status(200).json({
        msg: 'Answer Upvoted',
        votes: {
          upvotes: updated.upvotes.length,
          downvotes: updated.downvotes.length,
          total
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({
        msg: 'Error upvote answer',
        error: err
      })
    })
  })
  .catch(err => {
    res.status(400).json({
      msg: 'Answer findbyid error',
      error: err
    })
  })
}

const downVote = function(req, res) {
// let { questionId } = req.body
  let { answerId } = req.params
  let { userId } = req.user

  Answer.findById(answerId)
  .then(answer => {
    // if current user is the author
    if (userId == answer.userId._id) {
      return res.status(400).json({
        msg: 'You cannot vote',
        error: true
      })
    }
    // console.log(question)
    let upvotes = answer.upvotes
    let downvotes = answer.downvotes
    console.log('upvote & downvote state', upvotes, downvotes)
    // check if user already upvoted
    for (let i = 0; i < downvotes.length; i++) {
      if (downvotes[i] == userId) {
        return res.status(400).json({
          msg: 'You cannot downvote anymore',
          error: true
        })
      }
    }
    // if yes, check if he already downvoted, then delete the userId from downvotes array
    for (let i = 0; i < upvotes.length; i++) {
      if (upvotes[i] == userId) {
        upvotes.splice(i, 1)
        break
      }
    }

    Answer.findOneAndUpdate(
      { _id: answerId },
      { 
        $push: { downvotes: userId },
        upvotes: upvotes
      },
      { new: true }
    )
    .then(updated => {
      console.log('updated data ->',updated)
      let total = updated.upvotes.length - updated.downvotes.length
      res.status(200).json({
        msg: 'Answer Upvoted',
        votes: {
          upvotes: updated.upvotes.length,
          downvotes: updated.downvotes.length,
          total
        }
      })
    })
    .catch(err => {
      console.log(err)
      res.status(400).json({
        msg: 'Error upvote answer',
        error: err
      })
    })
  })
  .catch(err => {
    res.status(400).json({
      msg: 'Answer findbyid error',
      error: err
    })
  })
}

module.exports = {
  create, update, getAll, upVote, downVote
}