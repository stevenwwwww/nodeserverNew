// // services/websocketService.js

const { Server } = require('socket.io');
let io;
const connectedUsers = new Map();
const heartbeatInterval = 30000; // 30秒
const heartbeatTimeout = 10000; // 10秒
const reconnectDelay = 2000; // 重连延迟

const initWebSocket = (server,handleMessage) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
    pingTimeout: heartbeatTimeout,
    pingInterval: heartbeatInterval / 1000,
    maxHttpBufferSize: 1e8, // 增大HTTP缓冲区大小
  });;
  console.log('WebSocket server initialized');

  io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
    connectedUsers.set(socket.id, { lastHeartbeat: Date.now() });
    
    // 发送心跳消息
    const heartbeatIntervalId = setInterval(() => {
      if (socket.connected) {
        socket.emit('heartbeat', { message: 'heartbeat' });
      }
    }, heartbeatInterval);

    socket.on('subscribe', (topic) => {
      socket.join(topic);
      console.log(`User ${socket.id} subscribed to ${topic}`);
    });

    socket.on('unsubscribe', (topic) => {
      socket.leave(topic);
      console.log(`User ${socket.id} unsubscribed from ${topic}`);
    });

    socket.on('heartbeat', () => {
      connectedUsers.get(socket.id).lastHeartbeat = Date.now();
    });

    socket.on('message', (data) => {
      try {
        const { topic, message } = data; // 假设 data 包含 topic 和 message
        console.log(`Sending message to Kafka topic ${topic}:`, message);
        handleMessage({ topic, message }); // 处理消息
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    socket.on('disconnect', (reason) => {
      clearInterval(heartbeatIntervalId); // 清除心跳定时器
      connectedUsers.delete(socket.id);
      console.log('User disconnected:', socket.id, 'Reason:', reason);
      
      // // 尝试重连
      // attemptReconnect(socket);
    });
  });

  // 检测心跳
  setInterval(() => {
    const now = Date.now();
    connectedUsers.forEach((userData, socketId) => {
      if (now - userData.lastHeartbeat > heartbeatTimeout) {
        console.log(`Disconnecting inactive user: ${socketId}`);
        io.sockets.sockets.get(socketId)?.disconnect(true);
        connectedUsers.delete(socketId);
      }
    });
  }, heartbeatInterval);
  
};

// const attemptReconnect = (socket) => {
//   setTimeout(() => {
//     console.log(`Attempting to reconnect for socket: ${socket.id}`);
//     // 重新连接逻辑（根据需要重新连接逻辑）
//     io.connect(socket.handshake.address);
//   }, reconnectDelay);
// };

const broadcastMessage = (topic, message) => {
  io.to(topic).emit('message', message);
  console.log(`Broadcasting message to topic ${topic}:`, message);
};

module.exports = { initWebSocket, broadcastMessage };







