const express = require('express')
const router = express.Router()
const { getAll, create, update, upVote, downVote } = require('../controllers/answers-controller')
const { isAuthenticated } = require('../middleware/auth')

router
  .route('/')
  .post(isAuthenticated, create)

router
  .route('/:questionId')
  .get(getAll)
    
router
  .route('/:answerId')
  .put(isAuthenticated, update)

router.put('/upvote/:answerId/', isAuthenticated, upVote)
router.put('/downvote/:answerId/', isAuthenticated, downVote)

module.exports = router