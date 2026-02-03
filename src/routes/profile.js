import express from "express";
import { userAuth } from "../middlewares/userAuth.js";
import { validateEditProfileData } from "../utils/validation.js";
import bcrypt from "bcrypt";

export const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.send(user);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Edit data is not valid");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.send({
      message: `${loggedInUser.firstName} your profile is updated successfully`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = req.user;

    if (!oldPassword || !newPassword) {
      throw new Error("Both old and new password required");
    }

    const isOldPasswordValid = await user.validatePassword(oldPassword);
    if (!isOldPasswordValid) {
      throw new Error("Old Password is incorrect");
    }

    if (oldPassword === newPassword) {
      throw new Error("New Password must be different from old password");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedNewPassword;

    await user.save();

    res.send("Password Updated Successfully");
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
