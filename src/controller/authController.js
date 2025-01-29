import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import Vendor from "../model/Vendor.model.js";
import User from "../model/User.model.js";

dotenv.config();

export const registerUser = async (req, res) => {
  const { name, email, password, confirmPassword, role = "user", profileImage } = req.body;

  if (role !== "user") {
    return res.status(400).json({ message: "Role must be user" });
  }

  try {
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPass , profileImage});

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        profileImage: newUser?.profileImage,
        role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    const vendor = await Vendor.findOne({ email }); 

    if (!user && !vendor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user) {
      const isMatchUser = await user.comparePassword(password);

      if (!isMatchUser) {
        return res
          .status(400)
          .json({ message: "User's Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id, name: user.name, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "48h" },
      );

      return res.json({
        email: user.email,
        name: user.name,
        role: user.role,
        bookings:user.bookings,
        token,
      });
    } else if (vendor) {
      const isMatchVendor = await vendor.comparePassword(password);
      if (!isMatchVendor) {
        return res
          .status(400)
          .json({ message: "Vendor Invalid email or password" });
      }

      const token = jwt.sign(
        {
          id: vendor._id,
          fname: vendor.fname,
          lname: vendor.lname,
          email: vendor.email,
          role: vendor.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "48h" },
      );

      return res.json({
        email: vendor.email,
        fname: vendor.fname,
        lname: vendor.lname,
        role: vendor.role,
        token,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminUser = async () => {
  const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (!existingAdmin) {
    const admin = new User({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: process.env.ADMIN_ROLE,
      phone: process.env.ADMIN_PHONE,
    });

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);

    admin.password = hashedPass;

    await admin.save();
  } else {
    console.log("Admin user already exists");
  }
};
