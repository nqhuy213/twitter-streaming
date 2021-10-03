import React from "react";
import socketio from "socket.io-client";
const url = "http://localhost:3001";

export const socket = socketio(url);
export const SocketContext = React.createContext();