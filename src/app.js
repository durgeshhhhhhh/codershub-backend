import express from "express";
import { connectDB } from "./config/database.js";

const app = express();
const port = 3000;

connectDB()
  .then(() => {
    console.log("Connection Established Successfully...");

    app.listen(port, () => {
      console.log("Server is running on port: ", port);
    });
  })
  .catch((err) => {
    console.error("Error during connection Established: ", err);
  });
