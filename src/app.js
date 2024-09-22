// src/app.js

const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const connectDB = require('./config/database'); // 数据库连接配置
const { connectProducer, connectConsumer } = require('./config/kafka'); // Kafka 生产者和消费者
const apiRoutes = require('./routes/api'); // API 路由
const { initWebSocket } = require('./services/websocketService'); // Socket.IO 初始化
const healthCheckRouter = require('./routes/healthCheck'); // 健康检查路由
const { scheduleNotification } = require('./jobs/notificationJob'); // 定时任务

const app = express();
const server = http.createServer(app); // 创建 HTTP 服务器

// 解析 JSON 请求体
app.use(bodyParser.json());

// 注册 API 路由
app.use('/api', apiRoutes);

// 注册健康检查路由
app.use('/health', healthCheckRouter); // 监控服务健康状态

// 连接数据库
connectDB();

// 连接 Kafka
connectProducer(); // 启动 Kafka 生产者
connectConsumer(); // 启动 Kafka 消费者

// 启动定时任务
scheduleNotification(); // 配置定时任务，定期推送消息

// 初始化 Socket.IO
// initWebSocket(server); // 将 HTTP 服务器传递给 Socket.IO 初始化
// initWebSocket(app); // 将 Express 应用传递给 WebSocket 初始化
module.exports = server; // 导出服务器实例


