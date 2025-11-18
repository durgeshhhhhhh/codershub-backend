import express from "express";
import bcrypt from "bcrypt";
import { validateSignUpData } from "../utils/validation.js";
import User from "../models/user.js";
import validator from "validator";

export const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password, age, gender, about, skills } =
      req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
      gender,
      about,
      skills,
    });

    await user.save();
    res.send("User added successfully...");
  } catch (error) {
    res.status(404).send("Error in signup: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 3600000),
      });

      res.send("user login Successfully");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

authRouter.post("/logout", async (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });

  res.send("User Logout Successfully");
});
