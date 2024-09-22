// services/kafkaService.js

// const { producer, consumer, connectProducer, connectConsumer } = require('../config/kafka');

// const sendMessage = async (topic, message) => {
//   await producer.send({
//     topic,
//     messages: [{ value: JSON.stringify(message) }]
//   });
//   console.log(`Message sent to Kafka topic ${topic}`);
// };

// const consumeMessages = async (topic, callback) => {
//   await consumer.subscribe({ topic, fromBeginning: true });
//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       const parsedMessage = JSON.parse(message.value.toString());
//       callback(parsedMessage);
//     }
//   });
// };

// module.exports = {
//   sendMessage,
//   consumeMessages,
//   connectProducer,
//   connectConsumer
// };
// const { KafkaClient, Producer, Consumer } = require('kafka-node'); // 使用 kafka-node
// const config = require('dotenv').config(); // 加载环境变量
// const { broadcastMessage } = require('./websocketService'); // 导入 WebSocket 广播功能

// // 创建 Kafka 客户端
// const kafkaClient = new KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'localhost:9092' });
// const producer = new Producer(kafkaClient);
// const consumer = new Consumer(kafkaClient, [{ topic: 'notification-topic', partition: 0 }], { autoCommit: true });

// // 生产者事件处理
// producer.on('ready', () => {
//   console.log('Kafka producer connected');
// });

// producer.on('error', (err) => {
//   console.error('Error in Kafka producer:', err);
// });

// // 消费者事件处理
// consumer.on('message', (message) => {
//   console.log('Message received from Kafka:', message);
//   handleKafkaMessage(message);
// });

// consumer.on('error', (err) => {
//   console.error('Error in Kafka consumer:', err);
// });

// // 发送消息到 Kafka，支持重试机制
// const sendMessage = (topic, message, retries = 3) => {
//   const payloads = [{ topic, messages: JSON.stringify(message) }];
  
//   producer.send(payloads, (err, data) => {
//     if (err) {
//       console.error('Error sending message to Kafka:', err);
//       if (retries > 0) {
//         console.log(`Retrying... (${3 - retries + 1})`);
//         return sendMessage(topic, message, retries - 1); // 递归重试
//       }
//     } else {
//       console.log('Message sent to Kafka:', data);
//     }
//   });
// };

// // 处理 Kafka 消息
// const handleKafkaMessage = (message) => {
//     console.log(`Received message from Kafka topic ${topic}:`, payload);
//   try {
//     const parsedMessage = JSON.parse(message.value);
//     broadcastMessage(message.topic, parsedMessage); // 将消息广播到 WebSocket
//   } catch (error) {
//     console.error('Error parsing Kafka message:', error);
//   }
// };

// module.exports = { sendMessage, producer, consumer };
// services/kafkaService.js

const { KafkaClient, Producer, Consumer } = require('kafka-node');
const config = require('dotenv').config();
const { handleMessage } = require('./messageHandler');

const kafkaClient = new KafkaClient({ kafkaHost: process.env.KAFKA_BROKER || 'localhost:9092' });
const producer = new Producer(kafkaClient);
const consumer = new Consumer(kafkaClient, [{ topic: 'notification-topic', partition: 0 }], { autoCommit: true });

producer.on('ready', () => {
  console.log('Kafka producer connected');
});

producer.on('error', (err) => {
  console.error('Error in Kafka producer:', err);
});

consumer.on('message', (message) => {
    console.log('Message received from Kafka:', message);
    handleMessage(JSON.parse(message.value)); // 确保是 JSON
});
  

consumer.on('error', (err) => {
  console.error('Error in Kafka consumer:', err);
});

const sendMessage = (topic, message, retries = 3) => {
  const payloads = [{ topic, messages: JSON.stringify(message) }];
  
  producer.send(payloads, (err, data) => {
    if (err) {
      console.error('Error sending message to Kafka:', err);
      if (retries > 0) {
        console.log(`Retrying... (${3 - retries + 1})`);
        return sendMessage(topic, message, retries - 1);
      }
    } else {
      console.log('Message sent to Kafka:', data);
    }
  });
};

module.exports = { sendMessage, producer, consumer };

