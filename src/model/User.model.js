import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: true,
    trim: true,
  },
  email: {
    type: String,
    // required: true,
    // unique: true,
    trim: true,
  },
  companyName: {
    type: String,
    // required: true,
    // unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  profileImage:{
    type: String,
    trim: true,
  },
  bookings: [{ type: Schema.Types.ObjectId, ref: 'Booking' }],
  role: {
    type: String,
    default: "user",
  },
});

// Method to compare entered password with the hashed one in the database
userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
