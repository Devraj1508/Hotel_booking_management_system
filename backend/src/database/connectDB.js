
import mongoose from "mongoose";

export async function connectDB(
  uri = process.env.MONGODB_URI
) {
  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");

    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
}
