const express = require('express')
const router = express.Router()
const { getAll, getById, create, update, upVote, downVote, remove } = require('../controllers/questions-controller')
const { isAuthenticated } = require('../middleware/auth')

router
  .route('/')
  .get(getAll)
  .post(isAuthenticated, create)

router
  .route('/:questionId')
  .get(getById)
  .put(isAuthenticated, update)
  .delete(isAuthenticated, remove)

router.put('/upvote/:questionId/', isAuthenticated, upVote)
router.put('/downvote/:questionId/', isAuthenticated, downVote)

module.exports = router