// // services/websocketService.js

// const { Server } = require('socket.io');

// let io;
// const connectedUsers = new Map(); // 记录用户连接信息
// const heartbeatInterval = 30000; // 心跳间隔
// const heartbeatTimeout = 5000; // 超时检测

// const initWebSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: '*', // 根据需要设置
//       methods: ['GET', 'POST'],
//     },
//   });
//   console.log('WebSocket server initialized'); // 添加此日志
//   io.on('connection', (socket) => {
//     console.log('A user connected: ', socket.id);
//     connectedUsers.set(socket.id, { lastHeartbeat: Date.now() });

//     socket.on('subscribe', (topic) => {
//       socket.join(topic);
//       console.log(`User ${socket.id} subscribed to ${topic}`);
//     });

//     socket.on('unsubscribe', (topic) => {
//       socket.leave(topic);
//       console.log(`User ${socket.id} unsubscribed from ${topic}`);
//     });

//     socket.on('heartbeat', () => {
//       connectedUsers.get(socket.id).lastHeartbeat = Date.now();
//     });

//     socket.on('message', (data) => {
//       const { topic, message } = data;
//       console.log(`Sending message to Kafka topic ${topic}:`, message);
//       // 将消息发送到 Kafka
//       sendMessage(topic, message);
//       console.log(`Message sent to topic ${topic}:`, message);
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected: ', socket.id);
//       connectedUsers.delete(socket.id);
//     });
//   });

//   // 开始心跳检测
//   setInterval(() => {
//     const now = Date.now();
//     connectedUsers.forEach((userData, socketId) => {
//       if (now - userData.lastHeartbeat > heartbeatTimeout) {
//         console.log(`Disconnecting inactive user: ${socketId}`);
//         io.to(socketId).emit('disconnect', { reason: 'heartbeat timeout' });
//         io.sockets.sockets.get(socketId)?.disconnect();
//         connectedUsers.delete(socketId);
//       }
//     });
//   }, heartbeatInterval);
// };

// // 广播消息
// const broadcastMessage = (topic, message) => {
//     console.log(topic)
//     console.log("message",message)
//   io.to(topic).emit('message', message);
//   console.log(`Broadcasting message to topic ${topic}:`, message);
// };

// module.exports = { initWebSocket, broadcastMessage };

// const { Server } = require('socket.io');

// let io;
// const connectedUsers = new Map(); // 记录用户连接信息
// const heartbeatInterval = 30000; // 心跳间隔
// const heartbeatTimeout = 5000; // 超时检测

// const initWebSocket = (server) => {
//   io = new Server(server, {
//     cors: {
//       origin: '*', // 根据需要设置
//       methods: ['GET', 'POST'],
//     },
//   });
//   console.log('WebSocket server initialized');

//   io.on('connection', (socket) => {
//     console.log('A user connected: ', socket.id);
//     connectedUsers.set(socket.id, { lastHeartbeat: Date.now() });

//     socket.on('subscribe', (topic) => {
//       socket.join(topic);
//       console.log(`User ${socket.id} subscribed to ${topic}`);
//     });

//     socket.on('unsubscribe', (topic) => {
//       socket.leave(topic);
//       console.log(`User ${socket.id} unsubscribed from ${topic}`);
//     });

//     socket.on('heartbeat', () => {
//       connectedUsers.get(socket.id).lastHeartbeat = Date.now();
//     });

//     socket.on('message', (data) => {
//       const { topic, message } = data;
//       console.log(`Sending message to Kafka topic ${topic}:`, message);
//       // 将消息发送到 Kafka
//       sendMessage(topic, message);
//       console.log(`Message sent to topic ${topic}:`, message);
//     });

//     socket.on('disconnect', () => {
//       console.log('User disconnected: ', socket.id);
//       connectedUsers.delete(socket.id);
//     });
//   });

//   // 开始心跳检测
//   setInterval(() => {
//     const now = Date.now();
//     connectedUsers.forEach((userData, socketId) => {
//       if (now - userData.lastHeartbeat > heartbeatTimeout) {
//         console.log(`Disconnecting inactive user: ${socketId}`);
//         io.to(socketId).emit('heartbeat_timeout', { reason: 'heartbeat timeout' }); // 使用自定义事件名称
//         io.sockets.sockets.get(socketId)?.disconnect();
//         connectedUsers.delete(socketId);
//       }
//     });
//   }, heartbeatInterval);
// };

// // 广播消息
// const broadcastMessage = (topic, message) => {
//   console.log(topic);
//   console.log("message", message);
//   io.to(topic).emit('message', message);
//   console.log(`Broadcasting message to topic ${topic}:`, message);
// };

// module.exports = { initWebSocket, broadcastMessage };


const { Server } = require('socket.io');
const { handleMessage } = require('./messageHandler');
console.log('handleMessage:', handleMessage);

let io;
const connectedUsers = new Map();
const heartbeatInterval = 30000;
const heartbeatTimeout = 5000;

const initWebSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });
  console.log('WebSocket server initialized');

  io.on('connection', (socket) => {
    console.log('A user connected: ', socket.id);
    connectedUsers.set(socket.id, { lastHeartbeat: Date.now() });

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
    // });
// 可以添加其他事件处理，例如接收消息
        // socket.on('message', (message) => {
        //     console.log('socket 返回 Received message:', message);
        //     console.log('Received message:', message);
        // });

        socket.on('message', (data) => {
            const { topic, message } = data; // 假设 data 包含 topic 和 message
            console.log(`Sending message to Kafka topic ${topic}:`, message);
            handleMessage({ topic, message }); // 直接处理消息
          });
          });

  setInterval(() => {
    const now = Date.now();
    connectedUsers.forEach((userData, socketId) => {
      if (now - userData.lastHeartbeat > heartbeatTimeout) {
        console.log(`Disconnecting inactive user: ${socketId}`);
        io.sockets.sockets.get(socketId)?.disconnect();
        connectedUsers.delete(socketId);
      }
    });
  }, heartbeatInterval);
};

const broadcastMessage = (topic, message) => {
  io.to(topic).emit('message', message);
  console.log(`Broadcasting message to topic ${topic}:`, message);
};

module.exports = { initWebSocket, broadcastMessage };


// services/websocketService.js






