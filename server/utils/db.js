//mongo connection establishment
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("mongo db conncected successfully");
  } catch (error) {
    console.log("mongo db connection error", error);
  }
};

export default connectDB;
