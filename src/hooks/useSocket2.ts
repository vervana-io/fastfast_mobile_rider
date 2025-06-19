import {Socket, io} from 'socket.io-client';
import {useCallback, useEffect, useRef, useState} from 'react';

const SOCKET_SERVER_URL = 'https://c371-105-113-112-189.ngrok-free.app';

interface UseSocketReturn {
  isConnected: boolean;
  emit: (event: string, data: any) => void;
  createRoom: (roomName: string) => void;
}

export const useSocket2 = (): UseSocketReturn => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);

    const onConnect = () => {
    };

    const onDisconnect = () => {
    };

    socketRef.current.on('connect', onConnect);
    socketRef.current.on('disconnect', onDisconnect);

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect', onConnect);
        socketRef.current.off('disconnect', onDisconnect);
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      setIsConnected(socketRef.current?.connected);
    }
  }, []);

  const emit = useCallback(() => {
    if (socketRef.current) {

      //   socketRef.current.emit(event, data);
    }
  }, []);

  const createRoom = useCallback((roomName: string) => {
    if (socketRef.current) {
      socketRef.current.emit('create_room', roomName);
    }
  }, []);

  return {isConnected, emit, createRoom};
};
