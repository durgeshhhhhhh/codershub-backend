import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(
    "mongodb+srv://Durgesh_1511:mzEDrHTyNiieZ4Eo@cluster0.42ch4xc.mongodb.net/codershub"
  );
}
