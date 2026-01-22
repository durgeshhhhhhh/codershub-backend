import express from "express";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { requestRouter } from "./routes/request.js";
import { userRouter } from "./routes/user.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(
  cors({
    origin:  "https://joincodershub.com",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", authRouter);
app.use("/api", profileRouter);
app.use("/api", requestRouter);
app.use("/api", userRouter);

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
