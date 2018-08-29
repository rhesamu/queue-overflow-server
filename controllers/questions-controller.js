const Question = require('../models/Question')
const Answer = require('../models/Answer')

const getAll = function(req, res) {
  let inputData = {}
  if (req.query.tags) inputData.tags = req.query.tags
  if (req.query.search) inputData.search = req.query.search

  Question.find(inputData)
  .sort({ createdAt: 'descending' })
  .populate('userId', 'name')
  .then(questions => {
    console.log(questions)
    res.status(200).json(questions)
  })
  .catch(err => {
    console.log(err)
    res.status(400).json({
      msg: 'Get questions error',
      error: err
    })
  })
}

const getById = function(req, res) {
  Question.findById({ _id: req.params.questionId })
  .populate('userId', 'name')
  .then(question => {
    res.status(200).json(question)
  })
  .catch(err => {
    console.log(err)
    res.status(400).json({
      msg: 'Get question error',
      error: err
    })
  })
}

const create = function(req, res) {
  let { title, question, tags } = req.body
  let { userId } = req.user

  Question.create({
    userId, title, question, tags
  })
  .then(newQuestion => {
    console.log(newQuestion)
    res.status(201).json(newQuestion)
  })
  .catch(err => {
    console.log(err)
    res.status(400).json({
      msg: 'Create question error',
      error: err
    })
  })
}

const update = function(req, res) {
  let { questionId } = req.params
  let { title, question, tags } = req.body

  Question.findOneAndUpdate({
    _id: questionId
  }, {
    title, question, tags
  })
  .then(updated => {
    console.log(updated)
    res.status(200).json(updated)
  })
  .catch(err => {
    console.log(err)
    res.status(400).json({
      msg: 'Update question error',
      error: err
    })
  })
}

const upVote = function(req, res) {
  let { questionId } = req.params
  let { userId } = req.user

  Question.findById(questionId)
  .then(question => {
    // if current user is the author
    if (userId == question.userId._id) {
      return res.status(400).json({
        msg: 'You cannot vote',
        error: true
      })
    }
    // console.log(question)
    let upvotes = question.upvotes
    let downvotes = question.downvotes
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

    Question.findOneAndUpdate(
      { _id: questionId },
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
        msg: 'Upvoted',
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
        msg: 'Error upvote',
        error: err
      })
    })
  })
  .catch(err => {
    res.status(400).json({
      msg: 'question findbyid error',
      error: err
    })
  })
}

const downVote = function(req, res) {
  let { questionId } = req.params
  let { userId } = req.user

  Question.findById(questionId)
  .then(question => {
    if (userId == question.userId._id) {
      return res.status(400).json({
        msg: 'You cannot vote',
        error: true
      })
    }

    let upvotes = question.upvotes
    let downvotes = question.downvotes
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

    for (let i = 0; i < upvotes.length; i++) {
      if (upvotes[i] == userId) {
        upvotes.splice(i, 1)
        break
      }
    }

    Question.findOneAndUpdate(
      { _id: questionId },
      { 
        $push: { downvotes: userId },
        upvotes: upvotes
      },
      { new: true }
    )
    .then(updated => {
      console.log('updated data ->', updated)
      let total = updated.upvotes.length - updated.downvotes.length
      res.status(200).json({
        msg: 'Downvoted',
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
        msg: 'Error downvote',
        error: err
      })
    })
  })
  .catch(err => {
    res.status(400).json({
      msg: 'question findbyid error',
      error: err
    })
  })
}

const remove = function(req, res) {
  const { questionId } = req.params
  Question.findByIdAndRemove(questionId)
  .then(result => {
    res.status(200).json(result)
  })
  .catch(err => {
    res.status(400).json({
      msg: 'remove question error',
      error: err
    })
  })
}
 
module.exports = {
  getAll, getById, create, update, upVote, downVote, remove
}