// routes/ws.js

const express = require('express');
const router = express.Router();
const websocketService = require('../services/websocketService');

// WebSocket 路由，用于管理连接和消息传递
router.ws('/ws', (ws, req) => {
  websocketService.handleConnection(ws);
});

module.exports = router;
