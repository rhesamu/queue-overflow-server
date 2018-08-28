const express = require('express');
const router = express.Router();
const { getUserInfo } = require('../controllers/users-controller')

/* GET users listing. */
router.get('/:userId', getUserInfo)

module.exports = router;
