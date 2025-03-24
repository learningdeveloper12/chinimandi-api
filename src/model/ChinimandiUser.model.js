import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const chinimandiUserSchema = new mongoose.Schema({
  chnimandiUserId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    // required: true,
    trim: true,
  },
  profileImage:{
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const ChinimandiUser = mongoose.model("ChinimandiUser", chinimandiUserSchema);
export default ChinimandiUser;
