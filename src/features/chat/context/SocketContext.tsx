// contexts/SocketContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@/features/auth/hooks/useAuth';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];
  joinChat: (chatId: string) => void;
  leaveChat: (chatId: string) => void;
  sendSocketMessage: (data: any) => void;
  emitTyping: (conversationId: string, isTyping: boolean) => void;
  setupMessageHandlers: (
    onMessageReceive: (message: any) => void,
    onMessageSent: (message: any) => void,
    onTyping: (data: any) => void,
    onError: (error: any) => void,
    onMessageUpdate: (data: any) => void,
    onMessageDelete: (data: any) => void
  ) => () => void;
}

export const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { user, token } = useAuth();

  // Use VITE_SOCKET_URL for Vite apps
  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

  // Initialize socket connection
  useEffect(() => {
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Only create socket if it doesn't exist
    if (!socket) {
      console.log('🔌 Connecting to socket server:', SOCKET_URL);
      
      const newSocket = io(SOCKET_URL, {
        auth: {
          token: token,
        },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      setSocket(newSocket);

      // Event listeners
      newSocket.on('connect', () => {
        console.log('✅ Socket connected to port 5000:', newSocket.id);
        setIsConnected(true);
        
        // Request online users list
        newSocket.emit('getOnlineUsers');
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected from port 5000');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error (port 5000):', error.message);
        setIsConnected(false);
      });

      newSocket.on('onlineUsers', (users: string[]) => {
        console.log('Online users:', users);
        setOnlineUsers(users);
      });

      newSocket.on('userOnline', ({ userId }: { userId: string }) => {
        console.log('User came online:', userId);
        setOnlineUsers(prev => 
          prev.includes(userId) ? prev : [...prev, userId]
        );
      });

      newSocket.on('userOffline', ({ userId }: { userId: string }) => {
        console.log('User went offline:', userId);
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });
    }

    // Cleanup
    return () => {
      // Don't disconnect here, just remove listeners
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('onlineUsers');
        socket.off('userOnline');
        socket.off('userOffline');
      }
    };
  }, [user, token, SOCKET_URL]);

  // Setup message handlers dynamically
  const setupMessageHandlers = useCallback((
    onMessageReceive: (message: any) => void,
    onMessageSent: (message: any) => void,
    onTyping: (data: any) => void,
    onError: (error: any) => void,
    onMessageUpdate: (data: any) => void,
    onMessageDelete: (data: any) => void
  ) => {
    if (!socket) {
      console.log('Socket not available for setting up handlers');
      return () => {};
    }

    console.log('Setting up socket message handlers');
    
    socket.on('receiveMessage', onMessageReceive);
    socket.on('messageSent', onMessageSent);
    socket.on('userTyping', onTyping);
    socket.on('errorMessage', onError);
    socket.on('messageUpdated', onMessageUpdate);
    socket.on('messageDeleted', onMessageDelete);

    // Cleanup function
    return () => {
      console.log('Cleaning up socket message handlers');
      socket.off('receiveMessage', onMessageReceive);
      socket.off('messageSent', onMessageSent);
      socket.off('userTyping', onTyping);
      socket.off('errorMessage', onError);
      socket.off('messageUpdated', onMessageUpdate);
      socket.off('messageDeleted', onMessageDelete);
    };
  }, [socket]);

  // Socket actions
  const joinChat = useCallback((chatId: string) => {
    if (socket && isConnected) {
      console.log('Joining chat room:', chatId);
      socket.emit('joinChat', chatId);
    } else {
      console.log('Cannot join chat - socket not connected');
    }
  }, [socket, isConnected]);

  const leaveChat = useCallback((chatId: string) => {
    if (socket && isConnected) {
      console.log('Leaving chat room:', chatId);
      socket.emit('leaveChat', chatId);
    }
  }, [socket, isConnected]);

  const sendSocketMessage = useCallback((data: any) => {
    if (socket && isConnected) {
      console.log('Sending message via socket:', data);
      socket.emit('sendMessage', data);
    } else {
      console.log('Cannot send message - socket not connected');
    }
  }, [socket, isConnected]);

  const emitTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit('typing', { conversationId, isTyping });
    }
  }, [socket, isConnected]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    joinChat,
    leaveChat,
    sendSocketMessage,
    emitTyping,
    setupMessageHandlers,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};