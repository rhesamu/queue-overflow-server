const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/users-controller')
const { isAuthenticated } = require('../middleware/auth')
/* GET users listing. */
router.get('/', isAuthenticated, getUserInfo)

module.exports = router;
