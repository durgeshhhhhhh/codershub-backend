import "dotenv/config";
import express from "express";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.js";
import { profileRouter } from "./routes/profile.js";
import { requestRouter } from "./routes/request.js";
import { userRouter } from "./routes/user.js";
import cors from "cors";
import "./utils/cronjob.js";
import { paymentRouter } from "./routes/payment.js";
import http from "http";
import initializeSocket from "./utils/socket.js";
import { chatRouter } from "./routes/chat.js";

const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:5173", "https://joincodershub.com"],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter)

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("Connection Established Successfully...");

    server.listen(port, () => {
      console.log("Server is running on port:", port);
    });
  })
  .catch((err) => {
    console.error("Error during connection Established: ", err);
  });
