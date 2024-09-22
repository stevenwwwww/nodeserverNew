// services/messageHandler.js
const { processMessage } = require('./messageProcessor');

const handleMessage = (message) => {
    processMessage(message);
};

module.exports = { handleMessage };
