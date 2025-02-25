import React, { useState } from 'react';

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');

  // Define chatbot responses
  const chatbotResponses = {
    greetings: {
      patterns: ['hi', 'hello', 'hey', 'greetings'],
      responses: [
        "Hello! How can I help you today?",
        "Hi there! Welcome to Globetrotter's chat support!",
        "Hey! I'm here to assist you with your travel queries!"
      ]
    },
    about: {
      patterns: ['what is this bot about', 'what can you do', 'what do you do', 'help'],
      responses: [
        "I'm Globetrotter's virtual assistant! I can help you with information about destinations, travel packages, and booking queries. Feel free to ask me anything!"
      ]
    },
    destinations: {
      patterns: ['popular destinations', 'where can i travel', 'best places'],
      responses: [
        "We offer exciting travel packages to various destinations including Paris, Tokyo, New York, and many more! Would you like to know more about any specific destination?"
      ]
    },
    booking: {
      patterns: ['how to book', 'make reservation', 'book trip'],
      responses: [
        "Booking is easy! Just navigate to our Bookings page, select your desired package, and follow the simple checkout process. Need more specific guidance?"
      ]
    },
    contact: {
      patterns: ['contact support', 'human agent', 'real person'],
      responses: [
        "You can reach our human support team at support@globetrotter.com or call us at 1-800-GLOBE during business hours."
      ]
    },
    thanks: {
      patterns: ['thanks', 'thank you', 'appreciate it', 'thx'],
      responses: [
        "You're welcome! Let me know if you need anything else!",
        "Happy to help! Feel free to ask more questions!",
        "Anytime! Have a great day!"
      ]
    },
    goodbye: {
      patterns: ['bye', 'goodbye', 'see you', 'cya'],
      responses: [
        "Goodbye! Have a wonderful day!",
        "Take care! Come back if you need more help!",
        "Bye! Thanks for chatting with Globetrotter!"
      ]
    }
  };

  const findResponse = (message) => {
    const lowercaseMessage = message.toLowerCase();
    
    for (const [key, value] of Object.entries(chatbotResponses)) {
      if (value.patterns.some(pattern => lowercaseMessage.includes(pattern))) {
        return value.responses[Math.floor(Math.random() * value.responses.length)];
      }
    }
    
    return "I'm not sure how to respond to that. Could you please rephrase or ask about our destinations, bookings, or general travel information?";
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().getTime()
    };

    // Get bot response
    const botResponse = {
      text: findResponse(inputMessage),
      sender: 'bot',
      timestamp: new Date().getTime()
    };

    setMessages(prev => [...prev, userMessage, botResponse]);
    setInputMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
      {/* Header */}
      <div className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Globetrotter Assistant</h3>
        <button onClick={onClose} className="text-white hover:text-gray-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-purple-600"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot; 