// src/agent/AIAgent.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Input, Button, Spin, Alert } from 'antd'; // Using Ant Design components for UI
import { SendOutlined, LoadingOutlined } from '@ant-design/icons'; // Icons for send and loading
import './AIAgent.css'; // Import the new CSS file

const { TextArea } = Input;

export function AIAgent() {
  const [chatHistory, setChatHistory] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null); // Ref for auto-scrolling

 
  const BACKEND_CHAT_URL = 'http://localhost:8000/chat';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    // Add user's message to chat history
    const userMessage = { role: "user", parts: [{ text: currentMessage.trim() }] };
    setChatHistory((prev) => [...prev, userMessage]);
    setCurrentMessage(''); // Clear input field
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      // Prepare the entire chat history to send to your backend
      // The backend will then forward this to the Gemini API
      const payload = {
        chat_history: [...chatHistory, userMessage].map(msg => ({
          role: msg.role,
          parts: msg.parts
        })),
      };

      // Make the POST request to your FastAPI backend
      const response = await fetch(BACKEND_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      // Check if the response from your backend is successful and contains the expected text
      if (response.ok && result.response_text) {
        setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: result.response_text }] }]);
      } else {
        // Handle errors returned by your backend
        const errorMessage = result.detail || "Failed to get a response from the AI Agent backend.";
        setError(errorMessage);
        setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: `Error: ${errorMessage}` }] }]);
      }
    } catch (err) {
      // Handle network errors (e.g., backend server is not running)
      setError("Network error or failed to connect to the backend AI Agent service.");
      setChatHistory((prev) => [...prev, { role: "model", parts: [{ text: `Error: Network error or failed to connect.` }] }]);
      console.error("Backend AI Agent API call failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { 
      e.preventDefault(); 
      sendMessage();
    }
  };

  return (
    <div className="chatbot-container"> {/* Main container class */}
      <h2 className="chatbot-title">AI Agent</h2> {/* Title class */}

      {/* Chat Messages Display Area */}
      <div className="chat-messages"> {/* Chat messages class */}
        {chatHistory.length === 0 && (
          <div className="empty-chat-message">
            Start a conversation with the AI Agent!
          </div>
        )}
        {chatHistory.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              msg.role === 'user' ? 'user-message' : 'model-message'
            }`}
          >
            <p>{msg.parts[0].text}</p>
          </div>
        ))}
        {loading && (
          <div className="loading-message">
            <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} /> Thinking...
          </div>
        )}
        <div ref={messagesEndRef} /> {/* Element to scroll to */}
      </div>

      {/* Error Display */}
      {error && (
        <Alert
          message="Chat Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError('')}
          className="chat-error-alert" // Class for alert
        />
      )}

      {/* Message Input Area */}
      <div className="chat-input-area"> {/* Chat input area class */}
        <TextArea
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onPressEnter={handleKeyPress}
          placeholder="Type your message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          disabled={loading}
          className="message-input" // Class for textarea
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={sendMessage}
          loading={loading}
          disabled={!currentMessage.trim()}
          size="large"
          className="send-button" 
        >
          Send
        </Button>
      </div>
    </div>
  );
}
