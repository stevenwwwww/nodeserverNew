// src/server.js

const app = require('./app');
const http = require('http');
const { initWebSocket } = require('./services/websocketService'); // Socket.IO 初始化
const PORT = process.env.PORT || 9000;

// 创建 HTTP 服务器
// const server = http.createServer(app);

// 启动服务器监听端口
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
//     initWebSocket(server); // 将 HTTP 服务器传递给 Socket.IO 初始化
//     // initWebSocket(app); // 将 Express 应用传递给 WebSocket 初始化
// });
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // 启动 WebSocket 服务
    // const WS_PORT = process.env.WS_PORT || 8080;
    // console.log(server,"------------")
    initWebSocket(server);; // 传递 HTTP 服务器实例给 WebSocket
    
    // 启动 TCP 长连接服务
    // const TCP_HOST = process.env.TCP_HOST || '127.0.0.1';
    // const TCP_PORT = process.env.TCP_PORT || 6000;
    // startTCPClient(TCP_HOST, TCP_PORT);
});