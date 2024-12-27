import React, { useState } from 'react';
import Chatbot from './components/Chatbot';
import './App.css';
import { IoIosClose } from 'react-icons/io';
import { TbMessageChatbot } from 'react-icons/tb';
function App() {
  const [showChatbot, setShowChatbot] = useState(false); // State to control the visibility of the chatbot

  // Function to toggle the visibility of the chatbot
  const toggleChatbot = () => {
    setShowChatbot(!showChatbot); // Toggle the chatbot visibility
  };

  return (
    <div className="App">
      {/* Button to toggle chatbot visibility */}
      <button className="chatbot-button" onClick={toggleChatbot}>
      {showChatbot?<i><IoIosClose size={30} /></i> : 
  <i><TbMessageChatbot size={30} /></i>}
      </button>

      {/* Render Chatbot above the button when showChatbot is true */}
      {showChatbot && (
        <div className="chatbot-container-above">
          <Chatbot />
        </div>
      )}
    </div>
  );
}

export default App;
