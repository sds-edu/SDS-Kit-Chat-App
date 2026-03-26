import { useState, useEffect, useRef } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import './App.css';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080';

function App() {
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const [inputText, setInputText] = useState('');
  
  const { messages, isConnected, userCount, sendMessage, setMessages } = useWebSocket(
    isJoined ? WS_URL : null, 
    username
  );
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = () => {
    if (username.trim()) {
      setIsJoined(true);
    }
  };

  const handleLeave = () => {
    setIsJoined(false);
    setMessages([]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !isConnected) return;

    const payload = {
      type: 'chat',
      username,
      text: inputText
    };

    sendMessage(payload);
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSendMessage();
  };

  if (!isJoined) {
    return (
      <div className="join-container">
        <h2>Welcome to SDS Chat</h2>
        <p>Enter a username to join the conversation</p>
        <div className="join-controls">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleJoin()}
          />
          <button onClick={handleJoin}>Join Chat</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-info">
          <span>SDS Real-Time Chat</span>
          <div className={`status-badge ${isConnected ? 'online' : 'offline'}`}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>
        <div className="header-actions">
          <div className="user-count">
             👥 {userCount} Online
          </div>
          <button className="btn-leave" onClick={handleLeave}>Leave</button>
        </div>
      </div>
      
      <div className="chat-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.username === username ? 'sent' : 'received'}`}
          >
            <div className="message-info">
              {msg.username} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <div className="input-row">
          <input
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button className="btn-send" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
