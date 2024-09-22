// routes/api.js

const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { register, login } = require('../controllers/auth');
const notificationController = require('../controllers/notification');

// 受保护的通知推送 API
router.post('/notify', auth, notificationController.sendNotification);
router.post('/register', register);
router.post('/login', login);
module.exports = router;
