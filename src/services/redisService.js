// services/redisService.js

const redisClient = require('../config/redis');

const publish = (channel, message) => {
  redisClient.publish(channel, message);
  console.log(`Message published to Redis channel ${channel}`);
};

const subscribe = (channel, callback) => {
  redisClient.subscribe(channel);
  redisClient.on('message', (receivedChannel, message) => {
    if (receivedChannel === channel) {
      callback(JSON.parse(message));
    }
  });
};

module.exports = {
  publish,
  subscribe
};
