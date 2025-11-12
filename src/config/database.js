import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://Durgesh_1511:61r1gU8cIZiizpxV@cluster0.42ch4xc.mongodb.net/codershub"
  );
}
