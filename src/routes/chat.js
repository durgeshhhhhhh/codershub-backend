import express from "express";
import Chat from "../models/chat.js";
import { userAuth } from "../middlewares/userAuth.js";

export const chatRouter = express.Router();

chatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  try {
    const { targetUserId } = req.params;

    const userId = req.user._id;

    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName photoUrl");

    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });

      await chat.save();
    }

    res.json({
      message: "Chat fetched successfully",
      data: chat,
    });
  } catch (error) {
    res.status(400).json({
      error: error.message,
    });
  }
});
