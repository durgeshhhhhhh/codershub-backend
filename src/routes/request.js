import express from "express";
import { userAuth } from "../middlewares/auth.js";
import ConnectionRequest from "../models/connectionRequest.js";
import User from "../models/user.js";

export const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type: " + status });
      }

      // if (fromUserId.toString() === toUserId.toString()) {
      //   return res
      //     .status(400)
      //     .json({ message: "You cannot send request to yourself" });
      // }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({
          message: "User does not exist",
        });
      }

      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already exists!!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      let message = "";
      if (status === "interested") {
        message = `${req.user.firstName} showed interest in ${toUser.firstName}`;
      } else if (status === "ignored") {
        message = `${req.user.firstName} ignored ${toUser.firstName}`;
      }

      res.send({
        message,
        data,
      });
    } catch (error) {
      res.status(400).json({
        Error: error.message,
      });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;

      const isAllowedStatus = ["accepted", "rejected"];
      if (!isAllowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid status type " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found",
        });
      }

      connectionRequest.status = status;

      const data = await ConnectionRequest.save();

      res.send({ message: "Connection Request " + status, data });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);
