import mongoose, { Schema } from "mongoose";

const speakerSchema = new mongoose.Schema({
  speakerName: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  designation: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  aboutSpeaker: {
    type: String,
    required: true,
    trim: true,
  },
});

const Speaker = mongoose.model("Speaker", speakerSchema);
export default Speaker;
