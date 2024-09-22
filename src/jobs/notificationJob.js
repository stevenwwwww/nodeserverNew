// jobs/notificationJob.js

const cron = require('node-cron');
const kafkaService = require('../services/kafkaService');

// 定时发送通知，每天中午12点发送
const scheduleNotification = () => {
  cron.schedule('0 12 * * *', async () => {
    console.log('Sending daily notification...');
    
    const message = 'This is a scheduled notification';
    const users = ['user1', 'user2'];

    try {
      await kafkaService.sendMessage('notifications', { message, users });
      console.log('Scheduled notification sent successfully');
    } catch (error) {
      console.error('Failed to send scheduled notification:', error);
    }
  });
};

module.exports = {
  scheduleNotification
};
