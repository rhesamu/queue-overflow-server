const express = require('express');
const router = express.Router();
const { login, loginFB, register } = require('../controllers/auth-controller')
const questionsRouter = require('./questions')
const answersRouter = require('./answers')
const usersRouter = require('./users')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register', register)
router.post('/login', login)
router.post('/loginFB', loginFB)
router.use('/users', usersRouter)
router.use('/questions', questionsRouter)
router.use('/answers', answersRouter)

module.exports = router;
