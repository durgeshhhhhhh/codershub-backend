import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "Durgesh@1511");

    const { _id } = decodedMessage;

    const user = await User.findById({ _id });

    if (!user) {
      throw new Error("User does not exist");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new Error("Error: " + error.message);
  }
};
