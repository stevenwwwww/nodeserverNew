// services/messageHandler.js
const { broadcastMessage } = require('./websocketService');

// 处理接收到的 Kafka 消息
const handleMessage = (message) => {
  console.log('Received message from Kafka:', message);
  broadcastMessage(message.topic, message.message); // 广播消息到 WebSocket
};

module.exports = {
  handleMessage,
};
