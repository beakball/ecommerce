import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to database - ${mongoose.connection.host}`.bgGreen.white
    );
  } catch (error) {
    console.log(`Error in connecting to database - ${error}`.bgRed.black);
  }
};

export default connectDB;
