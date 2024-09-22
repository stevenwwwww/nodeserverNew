// controllers/notification.js

const kafkaService = require('../services/kafkaService');
const redisService = require('../services/redisService');

// 推送消息给 Kafka 和 Redis
const sendNotification = async (req, res) => {
  const { message, users } = req.body;

  try {
    // 将消息推送到 Kafka
    await kafkaService.sendMessage('notifications', { message, users });

    // 将消息推送到 Redis（用于 WebSocket 订阅）
    redisService.publish('notifications', JSON.stringify({ message, users }));

    return res.status(200).json({ success: true, message: 'Notification sent' });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return res.status(500).json({ success: false, message: 'Failed to send notification' });
  }
};

module.exports = {
  sendNotification
};
