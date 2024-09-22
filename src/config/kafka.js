// config/kafka.js

const kafka = require('kafka-node');

const kafkaHost = process.env.KAFKA_BROKER || 'localhost:9092';
const client = new kafka.KafkaClient({ kafkaHost });

const producer = new kafka.Producer(client);
const consumer = new kafka.Consumer(
  client,
  [{ topic: 'test-topic', partition: 0 }], // 替换为你的主题
  {
    autoCommit: true,
    groupId: 'notification-group'
  }
);

const connectProducer = () => {
  return new Promise((resolve, reject) => {
    producer.on('ready', () => {
      console.log('Kafka producer connected');
      resolve();
    });

    producer.on('error', (err) => {
      console.error('Error connecting Kafka producer:', err);
      reject(err);
    });
  });
};

const connectConsumer = () => {
  return new Promise((resolve, reject) => {
    consumer.on('message', (message) => {
      console.log(`Received message: ${message.value}`);
      // 处理接收到的消息
    });

    consumer.on('error', (err) => {
      console.error('Error connecting Kafka consumer:', err);
      reject(err);
    });

    consumer.on('ready', () => {
      console.log('Kafka consumer connected');
      resolve();
    });
  });
};

module.exports = {
  producer,
  consumer,
  connectProducer,
  connectConsumer
};