import nodemailer from "nodemailer";
import Vendor from "../model/Vendor.model.js";
import dotenv from "dotenv";
import { isValidObjectId } from "../utils/objectIdValidator.js";

dotenv.config();

// Helper function to generate a random password
const generateRandomPassword = (length = 8) => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
};

// Function to send email
const sendEmail = async (toEmail, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: toEmail,
    subject: subject,
    text: text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Controller to create a new vendor
export const createVendor = async (req, res) => {
  try {
    const role = req.user.role;
    const { fname, lname, email } = req.body;

    // Check if the user is an Admin
    if (role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Permission denied. Only Admin Can Add Vendors.",
      });
    }

    // Check if email already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists." });
    }

    // Generate a random password

    // const password = generateRandomPassword();

    const password = process.env.VENDORE_PASSWORD;

    // Create a new vendor
    const newVendor = new Vendor({
      fname,
      lname,
      email,
      password,
    });

    // Save vendor to the database
    await newVendor.save();

    // Send the login details to the vendor via email
    const subject = "Your Vendor Account Login Details";
    const text = `Hello ${fname},\n\nYou have been successfully registered as a vendor. Here are your login credentials:\n\nEmail: ${email}\nPassword: ${password}\n\nPlease change your password after your first login.\n\nThank you!`;

    await sendEmail(email, subject, text);

    // Send response
    res.status(201).json({
      success: true,
      message: "Vendor created and login credentials sent to email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create vendor",
      error: error.message,
    });
  }
};

// READ: Get all Vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.status(200).json({ success: true, vendors });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to get vendors",
      error: error.message,
    });
  }
};

export const updateVendor = async (req, res) => {
  const { id } = req.query;
  const { fname, lname } = req.body;

  if (!isValidObjectId(id)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Vendor ID format" });
  }

  try {
    const updatedVendor = await Vendor.findByIdAndUpdate(
      id,
      {
        fname,
        lname,
      },
      { new: true },
    );

    if (!updatedVendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    res.status(200).json({
      success: true,
      message: "Vendor updated successfully",
      vendor: updatedVendor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update Vendor",
      error: error.message,
    });
  }
};

// DELETE: Delete an Vendor by ID
export const deleteVendor = async (req, res) => {
  console.log("Deleting vendor with ID:", req.query.id);
  const { id } = req.query;

  // Check for a valid ObjectId format early
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid Vendor ID format",
    });
  }
  try {
    // Attempt to delete the vendor
    const vendor = await Vendor.findByIdAndDelete(id);

    if (!vendor) {
      // Vendor not found, return 404
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    // Successfully deleted vendor
    return res.status(200).json({
      success: true,
      message: "Vendor deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting vendor:", error);

    // Return a 500 server error with the error message
    return res.status(500).json({
      success: false,
      message: "Failed to delete vendor",
      error: error.message || error,
    });
  }
};
