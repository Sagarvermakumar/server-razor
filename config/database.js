import mongoose from "mongoose";

const connectDB = async () => {
  try {

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "IN",
    });
    console.log(`Databse connected to ${connection.connection.host}`);
  } catch (error) {
    console.log("DB Connection error ", error.message);
  }
};


export default connectDB ;