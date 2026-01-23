import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const userAuth = async (req, res, next) => {
  try {
    const cookie = req.cookies;

    const { token } = cookie;

    if (!token) {
      return res.status(401).send("Please Login");
    }

    const decodedMessage = await jwt.verify(token, process.env.JWT_SECRET);

    const { _id } = decodedMessage;

    const user = await User.findById({ _id });

    if (!user) {
      throw new Error("User does not exist");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(400).send("Auth Error: " + error.message);
  }
};
