import { useState, useEffect, useCallback, useRef } from 'react';

export const useWebSocket = (url, currentUsername) => {
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!url) return;

    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket Connected');
      setIsConnected(true);
    };

    // === TODO [Set user count and message] START ===

    // Your code here

    // === TODO [Set user count and message] END ===

    return () => {
      socket.close();
    };
  }, [url, currentUsername]);

  const sendMessage = useCallback((message) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error('WebSocket is not connected');
    }
  }, []);

  return { messages, isConnected, userCount, sendMessage, setMessages };
};
