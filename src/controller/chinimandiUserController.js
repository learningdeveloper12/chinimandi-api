import ChinimandiUser from "../model/ChinimandiUser.model.js";
import User from "../model/User.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";

export const updateChinimandiUser = async (req, res) => {
  console.log("Update user Controller");
  try {
    const { chinimandi_user_id, chinimandi_user_name, chinimandi_user_image } = req.body;

    const chinimandiUser = await ChinimandiUser.findOne({ chnimandiUserId: chinimandi_user_id });
    if (!chinimandiUser) {
      return res.status(404).json({ message: "User not found" });
    }
    await ChinimandiUser.updateOne({chnimandiUserId:chinimandi_user_id},{$set:{name:chinimandi_user_name, profileImage: chinimandi_user_image}})

    return res.status(201).json({
      success: true,
      message: "User updated successfully"
    });
  } catch (error) {
    console.error("Error updating User:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update User",
      error: error.message || "Unknown error",
    });
  }
};

// export const updateDiscountCoupen = async (req, res) => {
//   console.log("Update Post Controller");
//   try {
//     const { id } = req.query;
//     const {
//       eventId,
//       userId,
//       discountValueUSD,
//       discountPercentage,
//       discountType,
//       coupenCode,
//       discountValue,
//       startDate,
//       endDate,
//       isActive,
//     } = req.body;

//     if (!isValidObjectId(id)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid Post ID format" });
//     }

//     if (eventId && !isValidObjectId(eventId)) {
//       return res.status(400).json({ message: "Invalid event ID format" });
//     }

//     if (userId && !isValidObjectId(userId)) {
//       return res.status(400).json({ message: "Invalid user ID format" });
//     }

//     const discountCoupen = await DiscountCoupon.findByIdAndUpdate(
//       id,
//       {
//         eventId,
//         userId,
//         coupenCode,
//         discountValue,
//         discountValueUSD,
//         discountPercentage,
//         discountType,
//         startDate,
//         endDate,
//         isActive,
//       },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       message: "Post updated successfully",
//       discountCoupen,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to update Post",
//       error: error.message,
//     });
//   }
// };

// export const deleteDiscountCoupen = async (req, res) => {
//   console.log("Delete Post Controller");
//   try {
//     const { id } = req.query;

//     if (!isValidObjectId(id)) {
//       return res
//         .status(400)
//         .json({ message: "Invalid Post ID format" });
//     }

//     const discountCoupen = await DiscountCoupon.findByIdAndDelete(id);

//     if (!discountCoupen) {
//       return res.status(404).json({
//         success: false,
//         message: "Post not found",
//         error: error.message,
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Post deleted successfully",
//       discountCoupen,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Failed to delete Post",
//       error: error.message,
//     });
//   }
// };
