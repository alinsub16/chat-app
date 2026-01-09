// components/DebugSocket.tsx
import React from 'react';
import { useSocket } from '@features/chat/hooks/useSocket';

const DebugSocket: React.FC = () => {
  const { socket, isConnected, onlineUsers } = useSocket();

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg text-xs z-50">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span>Socket: {isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
        <div>Socket ID: {socket?.id || 'N/A'}</div>
        <div>Online Users: {onlineUsers.length}</div>
        <div>Backend URL: {import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'}</div>
        <div>Mode: {import.meta.env.MODE}</div>
      </div>
    </div>
  );
};

export default DebugSocket;