// components/TestConnection.tsx
import React, { useEffect } from 'react';
import { useSocket } from '@features/chat/hooks/useSocket';

const TestConnection: React.FC = () => {
  const { socket, isConnected, onlineUsers } = useSocket();

  useEffect(() => {
    // Test emit after connection
    if (isConnected && socket) {
      // console.log('✅ Connected to:', import.meta.env.VITE_SOCKET_URL);
      // console.log('🔌 Socket ID:', socket.id);
      
      // Test joining a room
      socket.emit('joinChat', 'test-room');
    }
  }, [isConnected, socket]);

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h3 className="font-bold mb-2">Connection Test</h3>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      <p>Online Users: {onlineUsers.length}</p>
      <p>Socket URL: {import.meta.env.VITE_SOCKET_URL}</p>
    </div>
  );
};