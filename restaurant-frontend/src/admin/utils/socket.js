// admin/utils/socket.js
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket","polling"],
  withCredentials: true,
});

export default socket;
