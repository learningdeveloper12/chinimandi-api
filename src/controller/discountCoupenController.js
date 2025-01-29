import DiscountCoupon from "../model/discountCoupen.model.js";
import Event from "../model/Events.model.js";
import User from "../model/User.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";

const populateUserDetails = async (userQuery) => {
  return userQuery.populate("createBy").populate("eventId");
};

export const createDiscountCoupen = async (req, res) => {
  console.log("Create Discount Coupen Controller");
  try {
    const {
      eventId,
      coupenCode,
      discountValue,
      discountValueUSD,
      discountPercentage,
      discountType,
      startDate,
      endDate,
      isActive,
    } = req.body;

    // Create Discount Coupen object
    const discountCoupen = new DiscountCoupon({
      eventId,
      coupenCode,
      discountValue,
      discountValueUSD,
      discountPercentage,
      discountType,
      startDate,
      endDate,
      isActive,
      createBy: req.user.id,
    });

    const user = await User.findById(req?.user?.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAuth = req.user.role;
    if (isAuth === "Admin") {
      await discountCoupen.save();

      return res.status(201).json({
        success: true,
        message: "Discount Coupen created successfully",
        discountCoupen,
      });
    } else {
      return res.status(403).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.error("Error creating discount coupen:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create discount coupen",
      error: error.message || "Unknown error",
    });
  }
};

export const getDiscountCoupenById = async (req, res) => {
  console.log("Get Discount Coupen By ID Controller");
  try {
    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Invalid Discount Coupen ID format" });
    }

    const discountCoupen = await populateUserDetails(
      DiscountCoupon.findById(id)
    );

    if (!discountCoupen) {
      return res.status(404).json({
        success: false,
        message: "Discount coupen not found",
        error: error.message,
      });
    }

    res.status(200).json({ success: true, discountCoupen });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get discount coupen by id",
      error: error.message,
    });
  }
};

export const getAllDiscountCoupen = async (req, res) => {
  console.log("Get All Discount Coupen Controller");
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let discountCoupons = await populateUserDetails(DiscountCoupon.find({}));

    discountCoupons = discountCoupons.map(async (coupon) => {
      const startDate = new Date(coupon.startDate);
      const endDate = new Date(coupon.endDate);

      if (today < startDate || today > endDate) {
        coupon.isActive = false;
      } else {
        coupon.isActive = true;
      }
      await coupon.save();

      return coupon;
    });

    discountCoupons = await Promise.all(discountCoupons);

    res.status(200).json({
      success: true,
      message: "Successfully retrieved and updated Discount Coupons",
      discountCoupons,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to get all Discount Coupons",
      error: error.message,
    });
  }
};

export const updateDiscountCoupen = async (req, res) => {
  console.log("Update Discount Coupen Controller");
  try {
    const { id } = req.query;
    const {
      eventId,
      userId,
      discountValueUSD,
      discountPercentage,
      discountType,
      coupenCode,
      discountValue,
      startDate,
      endDate,
      isActive,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Invalid discount coupen ID format" });
    }

    if (eventId && !isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Invalid event ID format" });
    }

    if (userId && !isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const discountCoupen = await DiscountCoupon.findByIdAndUpdate(
      id,
      {
        eventId,
        userId,
        coupenCode,
        discountValue,
        discountValueUSD,
        discountPercentage,
        discountType,
        startDate,
        endDate,
        isActive,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Discount Coupen updated successfully",
      discountCoupen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update discount coupen",
      error: error.message,
    });
  }
};

export const deleteDiscountCoupen = async (req, res) => {
  console.log("Delete Discount Coupen Controller");
  try {
    const { id } = req.query;

    if (!isValidObjectId(id)) {
      return res
        .status(400)
        .json({ message: "Invalid Discount Coupen ID format" });
    }

    const discountCoupen = await DiscountCoupon.findByIdAndDelete(id);

    if (!discountCoupen) {
      return res.status(404).json({
        success: false,
        message: "Discount Coupen not found",
        error: error.message,
      });
    }
    res.status(200).json({
      success: true,
      message: "Discount Coupen deleted successfully",
      discountCoupen,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete discount coupen",
      error: error.message,
    });
  }
};
