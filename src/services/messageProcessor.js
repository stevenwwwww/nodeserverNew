// services/messageProcessor.js
const { broadcastMessage } = require('./websocketService');

const processMessage = (message) => {
    console.log('Processing message:', message);
    broadcastMessage(message.topic, message);
};

module.exports = { processMessage };
