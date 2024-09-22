// src/server.js

const app = require('./app');
const http = require('http');
const { initWebSocket } = require('./services/websocketService'); // Socket.IO 初始化
const { handleMessage } = require('./services/messageHandler'); // 引入处理函数
const PORT = process.env.PORT || 9000;

// 创建 HTTP 服务器
// const server = http.createServer(app);

// 启动服务器监听端口
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // 启动 WebSocket 服务
    // const WS_PORT = process.env.WS_PORT || 8080;
    // console.log(server,"------------")
    initWebSocket(server, handleMessage); // 传递处理函数 // 传递 HTTP 服务器实例给 WebSocket
    
    // 启动 TCP 长连接服务
    // const TCP_HOST = process.env.TCP_HOST || '127.0.0.1';
    // const TCP_PORT = process.env.TCP_PORT || 6000;
    // startTCPClient(TCP_HOST, TCP_PORT);
});