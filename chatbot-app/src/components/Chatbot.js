import React, { useState, useEffect, useRef } from 'react';
import Message from './Message'; // Import the Message component
import '../styles/Chatbot.css';
import axios from 'axios'; // Import axios for API requests
import { IoSend } from "react-icons/io5";
import { IoMdSend } from "react-icons/io";
import { IoMdArrowBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { IoDocumentTextOutline } from "react-icons/io5"
import { IoIosArrowBack } from "react-icons/io";
import { TbHistoryOff } from "react-icons/tb";
import { IoChevronForward } from "react-icons/io5";
import { BiError } from "react-icons/bi";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [chatVisible, setChatVisible] = useState(false); // Control chat visibility
  const [searchMode, setSearchMode] = useState(true); // Toggle between search and chat
  const [suggestions, setSuggestions] = useState([]); // Store search suggestions
  const [showOptions, setShowOptions] = useState(false); // Control options display
  const [searchResultVisible, setSearchResultVisible] = useState(false); // Toggle search result pop-up
  const [searchResults, setSearchResults] = useState([]); // Store search results
  const [showHistory, setShowHistory] = useState(false); // Toggle chat history
  const [chatHistory, setChatHistory] = useState([]); // Store full chat history
  const chatWindowRef = useRef(null); // Reference to chat window for auto-scrolling
  const [viewHistory, setViewHistory] = useState(true)
  const [feedback, setFeedback] = useState('')
  const searchResultRef = useRef(null);
  const [isChatbot,setIsChatbot]=useState(true)
  const [search, setSearch]=useState(false)
  const [conversation,setConversation]=useState(false)
  const [history,setHistory] = useState(false)
  const searchIntents = [
   
    { tag: "services", patterns: ["What services do you offer?", "Tell me about your services", "What can you do for me?", "What services do you provide?"], responses: "We provide IT services such as Digital Presence Management and Core Technical Services. What services are you interested in?- Digital Presence Management\n- IT Core Technical Services" },
    // { tag: "about_us", patterns: ["Tell me about your company", "Can you tell me about your business?", "What does Maverick do?"] },
    // { tag: "faq", patterns: ["Do you have a FAQ?", "What are your frequently asked questions?", "Where can I find FAQs?"] },
   
    {
      tag: "digital_presence_management",
      patterns: ["Tell me more about Digital Presence Management", "What is Digital Presence Management?", "What services are included in Digital Presence Management?"],
      responses: [
        "Digital Presence Management includes the following services:\n- E-commerce startup\n- Brand Management Services\n- Digital Marketing & SEO\n- Website/App Development"
      ]
    },
    {
      tag: "it_technical_services",
      patterns: ["Tell me more about Core Technical Services", "What is IT Core Technical Services?", "Can you explain IT Core Technical Services?"],
      responses: [
        "Our Core Technical Services include the following:\n- Network Penetration Testing\n- Cyber Security\n- Managed IT Services\n- IT Recruitment"
      ]
    },
    {
      tag: "avail_services",
      patterns: ["How can I avail these services?", "How do I access these services?", "How can I get started with your services?"],
      responses: [
        "To avail our services, please visit our website at www.maverickservices.in and contact us through the contact form or reach us directly at https://maverickservices.in/contact-us/."
      ]
    },
    {
      tag: "location",
      patterns: ["Where is your location?", "Where are you located?", "Can you tell me your address?", "What is your physical location?"],
      responses: [
        "We are based in New Delhi, India. You can contact us via our website or visit us at our office for more details."
      ]
    },
    {
      tag: "contact",
      patterns: ["How can I contact you?","how to connect", "How do I get in touch?", "What is your contact information?", "Can I reach you online?"],
      responses: [
        "You can contact us through the contact form on our website at https://maverickservices.in/contact-us/. Alternatively, you can call us or email us through the details provided on our site."
      ]
    },
    {
      tag: "about_us",
      patterns: ["Tell me about your company", "Can you tell me about your business?", "What does Maverick do?"],
      responses: [
        "Maverick Services is a New Delhi-based IT and Business Services provider. We offer a combination of IT solutions, digital marketing, and creative services to help businesses grow online. Our team focuses on strategizing and executing projects to enhance your brand's presence."
      ]
    },

    {
      tag: "website",
      patterns: ["What is your website?", "Where can I find your website?", "Can you share your website URL?"],
      responses: [
        "Our website is www.maverickservices.in. Feel free to explore our services and get in touch with us!"
      ]
    },
    {
      tag: "faq",
      patterns: ["Do you have a FAQ?", "What are your frequently asked questions?", "Where can I find FAQs?"],
      responses: [
        "You can find our FAQ section on the website. Here is the link: www.maverickservices.in/faq."
      ]
    },
  ];


  // whenever enter in input then it will be run 
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Check if there are matching search results
      const matches = searchResults.filter((result) =>
        result.patterns.some((pattern) =>
          pattern.toLowerCase().includes(userInput.toLowerCase())
        )
      );
      
      setIsChatbot(!isChatbot)
      if (matches.length === 0) {
        // No results found
        setSearchResults([]);
        setSearchResultVisible(true); // Ensure the "No results" UI is displayed
      } else {
        // Display matching results
        setSearchResults(matches);
        setSearchResultVisible(true);
      }
    }
  };
  

  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);

    if (searchMode) {
      const filteredSuggestions = searchIntents.filter(intent =>
        intent.patterns.some(pattern => pattern.toLowerCase().includes(input.toLowerCase()))
      );
      setSuggestions(filteredSuggestions);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // New Changes (Optimization)
    setIsChatbot(!isChatbot)
    // setSearch(!search)
    // Set the clicked suggestion as the user's input
    setUserInput(suggestion);

    // Clear any previous suggestions
    setSuggestions([]);

    // Trigger search results display again (similar to a search behavior after a suggestion click)
    const filteredResults = searchIntents.filter(intent =>
      intent.patterns.some(pattern => pattern.toLowerCase().includes(suggestion.toLowerCase()))
    );

    // Update search results based on the new input (from the clicked suggestion)
    setSearchResults(filteredResults);

    // Show search results (mimicking Google-like search behavior)
    setSearchResultVisible(true);

    // You could also simulate the bot response here if needed
    // Add the selected suggestion as the user's message
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `${suggestion}`, sender: 'user' },
    ]);
    setViewHistory(false)
  };


  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    // Add user's message to the chat window
    const userMessage = { text: userInput, sender: 'user' };
    setMessages([...messages, userMessage]);
    setChatHistory((prevHistory) => [...prevHistory, userMessage]); // Save to chat history

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userInput,
      });
      const botResponse = response.data.botResponse;
      const botMessage = { text: botResponse, sender: 'bot' };

      // Simulate a slight delay to show loading spinner
      setTimeout(() => {
        // Add bot's response to the chat window
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setChatHistory((prevHistory) => [...prevHistory, botMessage]); // Save to chat history
        setLoading(false); // Stop loading spinner

        // Show options only after bot response has been displayed
        if (typeof botResponse === 'string' && botResponse.toLowerCase().includes('what services are you interested in?')) {
          setShowOptions(true);
        } else {
          setShowOptions(false);
        }
      }, 1000);

    } catch (error) {
      console.error('Error fetching bot response:', error);
      const botMessage = { text: "Sorry, I couldn't get a response.", sender: 'bot' };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
      setChatHistory((prevHistory) => [...prevHistory, botMessage]); // Save to chat history
      setLoading(false); // Stop loading spinner
    }

    // Reset the user input after the message has been sent
    setUserInput('');
  };


  const handleOptionClick = (option) => {
    setUserInput(option); // Set the selected option as the user's input
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `You selected: ${option}`, sender: 'user' },
    ]); // Add the option to the chat history
    setShowOptions(false); // Hide options after selection
    setLoading(true); // Set loading state to true while fetching a response
    setUserInput("")
    // Handle the response from the bot or perform actions based on the option selected
    // For example, you can send the option to the backend to fetch more information
    axios
      .post('http://localhost:5000/api/chat', { message: option })
      .then((response) => {
        const botResponse = response.data.botResponse;
        const botMessage = { text: botResponse, sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]); // Add bot response to chat
        setLoading(false); // Stop loading
      })
      .catch((error) => {
        console.error('Error fetching bot response:', error);
        const botMessage = { text: "Sorry, I couldn't get a response.", sender: 'bot' };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        setLoading(false); // Stop loading on error
      });
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    //New Changes (Optimization)
    setIsChatbot(!isChatbot)
   
  };

  const toggleChatVisibility = () => setChatVisible(!chatVisible);

  const startNewConversation = () => {
    // New Changes (Optimization) 
    setIsChatbot(!isChatbot)
    setConversation(!conversation)  

    setSearchMode(false);   // new changes (Optmization)
    setMessages([]); // Clear existing messages
    setUserInput(''); // Clear the search input field
    setSuggestions([]); // Clear suggestions
    setSearchResultVisible(false); // Hide search results pop-up
    setChatHistory([]);
    setViewHistory(false)

    const initialMessages = [
      { text: "...", sender: "bot", className: "loading" }
    ]
    setMessages(initialMessages)
    setTimeout(() => {
      const welcomeMessage = { text: 'Good morning and welcome to Maverick', sender: 'bot' };
      const assistMessage = { text: 'How may I assist you today?', sender: 'bot' };
      setMessages([welcomeMessage, assistMessage]); // Start the new conversation with a greeting message
      setChatHistory((prevHistory) => [...prevHistory, welcomeMessage, assistMessage]); // Add to chat history
      setLoading(false)
    }, 2000);
  };


  const goBackToChat = () => {
    // Clear chat messages and input
    setMessages([]);
    setUserInput('');
    setShowOptions(false); // Hide options when going back to chat
    setViewHistory(true); // Ensure chat window is visible, not history

    // Set the chatbot back to search mode (or initial mode)
    setSearchMode(true); // If you're switching to search mode after going back
    setViewHistory(true)
  };

  const SearchPop = () => {
    setSearchResultVisible(false)
    setIsChatbot(!isChatbot)
    setViewHistory(true)
    setUserInput('');
    setFeedback("")
  }

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (searchResultRef.current) {
      searchResultRef.current.scrollTop = searchResultRef.current.scrollHeight;
    }
  }, [searchResults]);

  const handleClick=()=>{
    setIsChatbot(!isChatbot)
    setSearch(!search)
  }

  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-container">
        {showHistory ? (
          <div className="chat-history">
            <h2>Conversation's</h2>
            {chatHistory.length === 0 ? (
              <p>No chat history available.</p>
            ) : (
              <div className="history-list">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`history-message ${msg.sender}`}>
                    <strong>{msg.sender === 'user' ? 'User' : 'Maverick Bot'}:</strong> {msg.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : searchResultVisible ? (
          <div className="search-result-popup" ref={searchResultRef}>
            <span onClick={SearchPop}><IoIosArrowBack size={31}  /> Search Results</span>
            {searchResults.length === 0 ? (
              <div className='search-noresult'>
                <i className='icon-noresult'><BiError size={30} /></i>
                <div className='nomatch-result'>
                <p>No Search results</p>
                <p>Please, try again</p>
                </div>
              </div>
            ) : (
              <>
                {searchResults.map((result, index) => (
                  <div key={index}>
                    {result.patterns.map((pattern, patternIndex) => {
                      // Check if the pattern includes the user input (case-insensitive)
                      if (pattern.toLowerCase().includes(userInput.toLowerCase())) {
                        return <h2 key={patternIndex}>{pattern}</h2>; // Display matching pattern
                      }
                      return null; 
                    })}
                    <div className='Search-artical'>
                      <img src="https://embed.tawk.to/_s/v4/assets/images/default-profile.svg" alt="profile-img" height={60} width={60} />
                      <div>
                        <p>MAVERICK</p>
                        <i>11 April 2024</i>
                      </div>
                    </div>
                    <p className='searchResult-responses' >{result.responses}</p>
                    <hr style={{ width: '40%', color: "#ccc" }}></hr>
                    <div className='user-feedback'>
                      <p>Was it helpful?</p>
                      <div className='image-feedbak'>
                        <div onClick={() => setFeedback('Thank for your valuable feedback')}><img src='https://embed.tawk.to/_s/v4/assets/images/rating/orange-upvote-1.svg' height={50} width={50} /></div>
                        <div onClick={() => setFeedback('Thank for your valuable feedback')}><img src='https://embed.tawk.to/_s/v4/assets/images/rating/orange-downvote-1.svg' height={50} width={50} /></div>
                      </div>
                      <p>{feedback}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        ) : (
          <>
            {searchMode ? (
              <div className="search-popup">
                <div className='Initiat-message'>
                  <h1>Hi there 👋</h1>
                  <p>Need help? Search our help center for answers or start a conversation:</p>
                </div>
                <div class="search-column">
              
                  <div className='search-input'>
                    <input
                      type="text"
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder="Search your answers"
                    />
                    <FaSearch className='icons' onClick={handleKeyPress} />
                  </div>

                
                  {userInput.trim() && (
                    
                    <div className="suggestions">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion.patterns[0])}
                        >
                          <i><IoDocumentTextOutline size={17} /></i>
                          {suggestion.patterns[0]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className='newConversation'>
                  <div className="new-conversation-button" onClick={startNewConversation}>
                    <i><IoSend size={20} /></i>
                    New Conversation
                  </div>
                </div>

              </div>
            ) : (
              <>
                <div className="chatbot-header">
                  <IoMdArrowBack onClick={goBackToChat} style={{ cursor: "pointer" }} size={22} />
                  <div className="avatar">🤖</div>
                  <div className="bot-name">Maverick AI Assistant</div>
                  <span>online</span>
                </div>

                <div className="chat-window" ref={chatWindowRef}>
                  {messages.map((msg, index) => (
                    <Message key={index} text={msg.text} sender={msg.sender} className={msg.className || ''} />
                  ))}
                  {loading && <Message key="loading" text="..." sender="bot" className="loading" />}
                  {showOptions && (
                    <div className="options-container">
                      <button onClick={() => handleOptionClick('Digital Presence Management')}>Digital Presence Management</button>
                      <button onClick={() => handleOptionClick('IT Core Services')}>IT Core Services</button>
                    </div>
                  )}
                </div>

                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage}>
                    <IoMdSend size={20} />
                  </button>
                </div>
              </>
            )}
          </>
        )}
        {viewHistory && (
          <div className="history-button" onClick={toggleHistory}>
            {showHistory ? (
              <span className='hideHistory'><TbHistoryOff size={28} /></span>
            ) : (
              <div className='history-button1'>
                <p>Conversation's</p>
                <div className="history-avatar">
                  <img src="https://s3.amazonaws.com/tawk-to-pi/bot/025e0d0c0f63f2e08bbe8376" height={50} width={50} />
                  <div className='history-messages'>
                    <span className="assistant-name">Maverick AI Assistant</span>
                    <span className="assistant-message">How may I assist you</span>
                  </div>
                  <span><IoChevronForward size={30} /></span>
                </div>
              </div>
            )}
          </div>
        )}

       {/* {isChatbot ? (<>
        <div className="search-popup">
                <div className='Initiat-message'>
                  <h1>Hi there 👋</h1>
                  <p>Need help? Search our help center for answers or start a conversation:</p>
                </div> 
                <div class="search-column">            
                 <div className='search-input'>
                    <input
                      type="text"
                      value={userInput}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyPress}
                      placeholder="Search your answers"
                    />
                    <FaSearch className='icons' onClick={handleKeyPress} />
                  </div>
                  {userInput.trim() && (
                    <div className="suggestions">
                      {suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="suggestion-item"
                          onClick={() => handleSuggestionClick(suggestion.patterns[0])}
                        >
                          <i><IoDocumentTextOutline size={17} /></i>
                          {suggestion.patterns[0]}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className='newConversation'>
                  <div className="new-conversation-button" onClick={startNewConversation}>
                    <i><IoSend size={20} /></i>
                    New Conversation
                  </div>
                </div>
        </div>
        <div className="history-button" onClick={toggleHistory}>
            {showHistory ? (
              <span className='hideHistory'><TbHistoryOff size={28} /></span>
            ) : (
              <div className='history-button1'>
                <p>Conversation's</p>
                <div className="history-avatar">
                  <img src="https://s3.amazonaws.com/tawk-to-pi/bot/025e0d0c0f63f2e08bbe8376" height={50} width={50} />
                  <div className='history-messages'>
                    <span className="assistant-name">Maverick AI Assistant</span>
                    <span className="assistant-message">How may I assist you</span>
                  </div>
                  <span><IoChevronForward size={30} /></span>
                </div>
              </div>
            )}
        </div>
        </>):(searchResultVisible ? (<div className="search-result-popup" ref={searchResultRef}>
            <span onClick={SearchPop}><IoIosArrowBack size={31}  /> Search Results</span>
            {console.log(searchResults.length)}
            {searchResults.length === 0 ? (
              <>
              <div className='search-noresult'>
                {console.log("It is working")}
                <i className='icon-noresult'><BiError size={30} /></i>
                <div className='nomatch-result'>
                <p>No Search results</p>
                <p>Please, try again</p>
                </div>
              </div>
              </>
            ) : (
              <>
              {console.log("It is not working")}
                {searchResults.map((result, index) => (
                  <div key={index}>
                    {result.patterns.map((pattern, patternIndex) => {
                      // Check if the pattern includes the user input (case-insensitive)
                      if (pattern.toLowerCase().includes(userInput.toLowerCase())) {
                        return <h2 key={patternIndex}>{pattern}</h2>; // Display matching pattern
                      }
                      return null; 
                    })}
                    <div className='Search-artical'>
                      <img src="https://embed.tawk.to/_s/v4/assets/images/default-profile.svg" alt="profile-img" height={60} width={60} />
                      <div>
                        <p>MAVERICK</p>
                        <i>11 April 2024</i>
                      </div>
                    </div>
                    <p className='searchResult-responses' >{result.responses}</p>
                    <hr style={{ width: '40%', color: "#ccc" }}></hr>
                    <div className='user-feedback'>
                      <p>Was it helpful?</p>
                      <div className='image-feedbak'>
                        <div onClick={() => setFeedback('Thank for your valuable feedback')}><img src='https://embed.tawk.to/_s/v4/assets/images/rating/orange-upvote-1.svg' height={50} width={50} /></div>
                        <div onClick={() => setFeedback('Thank for your valuable feedback')}><img src='https://embed.tawk.to/_s/v4/assets/images/rating/orange-downvote-1.svg' height={50} width={50} /></div>
                      </div>
                      <p>{feedback}</p>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>):(conversation ? (<>Conversation</>) : (<>History</>)))} */}

      </div>
      <a className='free-Livechat'> <img src="https://www.tawk.to/wp-content/uploads/2020/04/tawk-sitelogo.png" height={23} width={23} />
        <i>Ad free <strong>live chat</strong> to maverick AI Assistant</i> </a>
    </div>
  );
};

export default Chatbot;








