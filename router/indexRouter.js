const express = require('express');
const userRouter = require('../router/userRouter')
const router = express.Router();

router.use('/user', userRouter)

module.exports = router