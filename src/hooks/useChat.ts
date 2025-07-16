import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const useChat = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const socketIo = io('http://localhost:1337', {
      autoConnect: false
    });

    socketIo.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
    });

    socketIo.on('chat-message', (data: { channel: string; message: string }) => {
      setMessages(prev => [...prev, data.message]);
    });

    socketIo.on('joined-channel', (data: { channel: string; handle: string }) => {
      console.log(`Successfully joined ${data.channel} as ${data.handle}`);
    });

    socketIo.on('error', (data: { message: string }) => {
      setError(data.message);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  const joinChannel = (channel: string, handle: string) => {
    if (socket) {
      socket.connect();
      socket.emit('join-channel', { channel, handle });
    }
  };

  const sendMessage = (message: string, handle: string) => {
    if (socket) {
      socket.emit('chat-message', { handle, message, type: 'chat' });
    }
  };

  const disconnect = () => {
    if (socket) {
      socket.disconnect();
    }
  };

  return {
    socket,
    messages,
    isConnected,
    error,
    joinChannel,
    sendMessage,
    disconnect
  };
};

export default useChat;
