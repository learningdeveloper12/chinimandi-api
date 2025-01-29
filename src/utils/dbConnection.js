import mongoose from "mongoose";
import { createAdminUser } from "../controller/authController.js";

const dbConnection = (uri) => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log("MongoDB connected successfully");
      createAdminUser();
    })
    .catch((err) => console.error("Failed to connect to MongoDB", err));
};

export default dbConnection;
