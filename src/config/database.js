// config/database.js

const mongoose = require('mongoose');

// 从环境变量中读取 MongoDB 连接字符串
const dbURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mydatabase';

const connectDB = async () => {
  try {
    // 连接到 MongoDB 数据库
    await mongoose.connect(dbURI); // 不再需要 useNewUrlParser 和 useUnifiedTopology
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);  // 退出进程并返回错误码
  }
};

module.exports = connectDB;

