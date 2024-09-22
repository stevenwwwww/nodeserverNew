// config/redis.js

const redis = require('redis');

// 从环境变量中读取 Redis 配置
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || null, // 如果有密码可以添加
  db: process.env.REDIS_DB || 0 // 可选，设置要连接的数据库
});

// 连接事件监听
redisClient.on('connect', () => {
  console.log('Redis connected');
});

// 错误事件监听
redisClient.on('error', (err) => {
  console.error('Redis connection error:', err);
});

// 订阅事件示例
redisClient.on('message', (channel, message) => {
  console.log(`Received message from channel ${channel}: ${message}`);
});

// 你可以在这里添加更多 Redis 相关的逻辑，比如发布/订阅等

module.exports = redisClient;
