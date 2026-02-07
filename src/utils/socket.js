import { Server } from "socket.io";
import crypto from "crypto";
import Chat from "../models/chat.js";

const getSecureRoomId = (userID, targetUserId) => {
  const sortedIds = [userID, targetUserId].sort().join("_");

  const secret = process.env.ROOM_SECRET;

  const hash = crypto
    .createHmac("sha256", secret)
    .update(sortedIds)
    .digest("hex");

  return `room_${hash}`;
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://joincodershub.com"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // handle Event
    socket.on("joinChat", ({ firstName, userId, targetUserId }) => {
      const roomId = getSecureRoomId(userId, targetUserId);
      console.log(firstName + " Joining room: ", roomId);
      socket.join(roomId);
    });

    socket.on(
      "sendMessage",
      async ({ firstName, lastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecureRoomId(userId, targetUserId);

          //   save messages to database

          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          io.to(roomId).emit("messageReceived", { firstName, lastName, text });
        } catch (error) {
          console.log("Error saving message to database: ", error.message);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

export default initializeSocket;
