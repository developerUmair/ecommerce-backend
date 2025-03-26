import mongoose from "mongoose";
import { DB_URI, NODE_ENV } from "../config/env.js";

if (!DB_URI) {
  throw new Error(
    "Please defined the MONGODB_URI variable inside .env.<development/producation>.local"
  );
}

const connectToDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log(`Connected to database ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting database", error);
    process.exit(1);
  }
};

export default connectToDatabase;