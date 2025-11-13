import express from "express";
import { connectDB } from "./config/database.js";
import User from "./models/user.js";
import { validateSignUpData } from "./utils/validation.js";
import bcrypt from "bcrypt";
import validator from "validator";

const app = express();
const port = 3000;

app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

    const { firstName, lastName, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      email,
      password: hashPassword,
    });

    await user.save();
    res.send("User added successfully...");
  } catch (error) {
    res.status(404).send("Error in signup: " + error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      throw new Error("Invalid Email");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid Credentials");
    } else {
      res.send("user login Successfully");
    }
  } catch (error) {
    res.status(400).send(`ERROR : ${error.message}`);
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.email;

  try {
    const user = await User.find({ email: userEmail });

    if (user.length === 0) {
      res.send("No such user exist");
    } else {
      res.send(user);
    }
  } catch (error) {
    res.status(404).send("Error in finding user: ", error);
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});

    res.send(users);
  } catch (error) {
    res.status(404).send("Error in finding feed: ", error);
  }
});

app.delete("/user", async (req, res) => {
  const id = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(id);

    res.send("User Deleted Successfully");
    console.log(user);
  } catch (error) {
    console.log("Error while deleteing the user: ", error);
  }
});

app.patch("/user", async (req, res) => {
  const id = req.body.userId;
  const data = req.body;

  try {
    const allowedUpdates = ["userId", "firstName", "lastName", "age", "skills"];

    const isUpdateAllowed = Object.keys(data).every((k) =>
      allowedUpdates.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update Not Allowed");
    }

    if (data.skills.length > 10) {
      throw new Error("Skill must be less than or equala to 10");
    }

    const user = await User.findByIdAndUpdate(id, data, {
      runValidators: true,
    });

    res.send("User Updated Successfully");
  } catch (error) {
    res.status(400).send("Error in updating user: " + error.message);
  }
});

connectDB()
  .then(() => {
    console.log("Connection Established Successfully...");

    app.listen(port, () => {
      console.log("Server is running on port:", port);
    });
  })
  .catch((err) => {
    console.error("Error during connection Established: ", err);
  });
