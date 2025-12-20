import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URI_1 || process.env.CLIENT_URI_2 || "*",
      methods: ["GET", "POST"],
    },
  });

   io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // join room (client should emit 'join_payement_room' with orderId)
    socket.on("join_payment_room", (orderId) => {
      console.log('this is orderId', orderId)
      if (orderId) {
        socket.join(orderId);
        console.log(`Socket ${socket.id} joined room ${orderId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
