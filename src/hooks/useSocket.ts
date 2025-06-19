import io, {Socket} from 'socket.io-client';
import {useEffect, useRef, useState} from 'react';

import {GeoPosition} from 'react-native-geolocation-service';

interface UseSocketOptions {
  url: string;
  options?: any;
  isOnline: boolean;
}

const useSocket = ({url, options = {}, isOnline = false}: UseSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);

  const isConnected = socketRef.current?.connected;

  useEffect(() => {
    if (isOnline) {
      // Initialize socket connection
      const socket = io(url, {
        transports: ['websocket'], // Use WebSocket transport
        reconnection: true, // Enable reconnection
        ...options,
      });

      socketRef.current = socket;

      // Cleanup: Disconnect socket on unmount
      return () => {
        if (socketRef.current) {
          socketRef.current.disconnect();
        }
      };
    }
  }, [isOnline, url]);

  // Function to emit a message
  const emitMessage = (event: string, message: any) => {
    if (socketRef.current) {
      socketRef.current.emit(event, message);
    } else {
    }
  };

  // Function to create a room
  const createRoom = (roomName: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('createRoom', roomName);
    } else {
    }
  };

  const checkRoomExists = (roomName: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(
        'checkRoomExists',
        roomName,
        (roomExists: boolean) => {
          if (roomExists) {
            return true;
          } else {
            return false;
          }
        },
      );
    }
    return false;
  };

  const checkUserIsInRoom = (
    roomName: number,
    callback: (data: any) => void,
  ) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(
        'check_user_is_in_room',
        roomName,
        (val: boolean) => {
          callback(val);
        },
      );
    }
  };

  const removeRoom = (roomName: number) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('removeRoom', roomName);
    }
  };

  const updateRiderLocation = (
    riderId: string,
    position: GeoPosition['coords'],
  ) => {
    if (socketRef.current) {
      socketRef.current.emit('updateRiderLocation', {
        riderId,
        position,
      });
    }
  };

  // Function to manually disconnect the socket
  const disconnectSocket = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.disconnect();
    }
  };

  // Function to manually reconnect the socket
  const reconnectSocket = () => {
    if (socketRef.current && isConnected) {
      socketRef.current.connect();
    }
  };

  return {
    isConnected,
    emitMessage,
    createRoom,
    checkRoomExists,
    checkUserIsInRoom,
    removeRoom,
    disconnectSocket,
    reconnectSocket,
    updateRiderLocation,
  };
};

export default useSocket;
