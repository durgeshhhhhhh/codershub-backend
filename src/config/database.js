import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
}
