const axios = require('axios'); // Import axios for making HTTP requests
const Chat = require('../models/chatModel'); // Import the chat model

// Controller for handling chat
exports.handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    // Make a request to the custom ML model API to get a response
    const response = await axios.post('http://127.0.0.1:5000/api/chat', { message });

    // Extract the bot's response from the API
    const botResponse = response.data.botResponse || "Sorry, I couldn't understand that.";

    // Save the interaction only if it was initiated by the user
    if (message.trim() !== "") {
      const newChat = new Chat({
        userMessage: message,
        botResponse: botResponse,
      });

      // await newChat.save();
    }

    // Send the response back to the frontend
    return res.status(200).json({ userMessage: message, botResponse });
  } catch (error) {
    console.error('Error processing chat:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
