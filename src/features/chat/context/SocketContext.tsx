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
    onMessageDelete: (data: any) => void,
    onConversationCreated?: (data: any) => void,   // added
    onConversationDeleted?: (data: any) => void   // added
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

  const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

  useEffect(() => {
    if (!user || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    if (!socket) {
      console.log('🔌 Connecting to socket server:', SOCKET_URL);

      const newSocket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 10000,
      });

      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        setIsConnected(true);
        newSocket.emit('getOnlineUsers');
      });

      newSocket.on('disconnect', () => setIsConnected(false));
      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error.message);
        setIsConnected(false);
      });

      newSocket.on('onlineUsers', (users: string[]) => setOnlineUsers(users));

      newSocket.on('userOnline', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => (prev.includes(userId) ? prev : [...prev, userId]));
      });

      newSocket.on('userOffline', ({ userId }: { userId: string }) => {
        setOnlineUsers(prev => prev.filter(id => id !== userId));
      });
    }

    return () => {
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

  // Setup message handlers with conversation events
  const setupMessageHandlers = useCallback((
    onMessageReceive: (message: any) => void,
    onMessageSent: (message: any) => void,
    onTyping: (data: any) => void,
    onError: (error: any) => void,
    onMessageUpdate: (data: any) => void,
    onMessageDelete: (data: any) => void,
    onConversationCreated?: (data: any) => void,
    onConversationDeleted?: (data: any) => void
  ) => {
    if (!socket) {
      console.log('Socket not available for setting up handlers');
      return () => {};
    }

    socket.on('receiveMessage', onMessageReceive);
    socket.on('messageSent', onMessageSent);
    socket.on('userTyping', onTyping);
    socket.on('errorMessage', onError);
    socket.on('messageUpdated', onMessageUpdate);
    socket.on('messageDeleted', onMessageDelete);

    if (onConversationCreated) socket.on('conversation:created', onConversationCreated);
    if (onConversationDeleted) socket.on('conversation:deleted', onConversationDeleted);

    return () => {
      socket.off('receiveMessage', onMessageReceive);
      socket.off('messageSent', onMessageSent);
      socket.off('userTyping', onTyping);
      socket.off('errorMessage', onError);
      socket.off('messageUpdated', onMessageUpdate);
      socket.off('messageDeleted', onMessageDelete);

      if (onConversationCreated) socket.off('conversation:created', onConversationCreated);
      if (onConversationDeleted) socket.off('conversation:deleted', onConversationDeleted);
    };
  }, [socket]);

  const joinChat = useCallback((chatId: string) => {
    if (socket && isConnected) socket.emit('joinChat', chatId);
  }, [socket, isConnected]);

  const leaveChat = useCallback((chatId: string) => {
    if (socket && isConnected) socket.emit('leaveChat', chatId);
  }, [socket, isConnected]);

  const sendSocketMessage = useCallback((data: any) => {
    if (socket && isConnected) socket.emit('sendMessage', data);
  }, [socket, isConnected]);

  const emitTyping = useCallback((conversationId: string, isTyping: boolean) => {
    if (socket && isConnected) socket.emit('typing', { conversationId, isTyping });
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

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
