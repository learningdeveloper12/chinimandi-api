import Post from "../model/post.model.js";
import User from "../model/User.model.js";
import Like from "../model/Like.model.js";
import Comment from "../model/Comment.model.js";
import ChinimandiUser from "../model/ChinimandiUser.model.js";
import { isValidObjectId } from "../utils/objectIdValidator.js";
import mongoose from "mongoose";
import multer from "multer";
import { uploadImage } from "../utils/imageUploader.utils.js";
import { upload } from "../routes/imageUploder.routes.js";
import { uploadFile, uploadFileBuffer } from "../lib/file-uploder/index.js";

const populateUserDetails = async (userQuery) => {
  return userQuery.populate("createBy");
};

export const createPost = async (req, res) => {

  console.log("Create Post Controller");
  try {
    const {
      eventId,
      description,
      postImage,
      like,
      comments,
      chinimandi_user_id,
      chinimandi_user_name,
      chinimandi_user_image,
      share,
    } = req.body;

    console.log(req.body,"BODY DATA")

    let postImages;

    if (req.file) {
      const profileImage = await uploadFileBuffer(req.file);
      postImages = profileImage;
    }    

    let existChinimandiUser = await ChinimandiUser.findOne({
      chnimandiUserId: chinimandi_user_id,
    });

    let chinimandiUserId = "";

    if (existChinimandiUser == null) {
      const chinimandiUser = new ChinimandiUser({
        chnimandiUserId: chinimandi_user_id,
        name: chinimandi_user_name,
        profileImage: chinimandi_user_image,
      });

      await chinimandiUser.save();
      existChinimandiUser = chinimandiUser;
      const newChinimandiUser = {
        existChinimandiUserId: existChinimandiUser._id,
      };
      chinimandiUserId = newChinimandiUser.existChinimandiUserId;
    } else {
      chinimandiUserId = existChinimandiUser._id;
    }

    const post = new Post({
      eventId,
      description,
      postImage : postImages,
      share,
      createBy: chinimandiUserId,
    });

    await post.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Error creating Post:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Post",
      error: error.message || "Unknown error",
    });
  }
};

export const getPost = async (req, res) => {
  console.log("Get Post Controller");
  try {
    const { userId, eventId, postId } = req.query;
    console.log("userId", userId);
    let chinimandiUser = "";
    let matchQuery = {};

    if (eventId != null && eventId != "") {
      matchQuery = {
        ...matchQuery,
        eventId: new mongoose.Types.ObjectId(eventId),
      };
    }

    if (postId != null && postId != "") {
      matchQuery = {
        ...matchQuery,
        _id: new mongoose.Types.ObjectId(postId),
      };
    }

    let postData = await Post.aggregate([
      { $match: matchQuery },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
          pipeline: [
            {
              $lookup: {
                from: "chinimandiusers",
                localField: "likedBy",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            { $unwind: "$userDetails" },
          ],
        },
      },
      {
        $lookup: {
          from: "chinimandiusers",
          localField: "createBy",
          foreignField: "_id",
          as: "createdUserDetail"
        },
      },
      { $unwind: "$createdUserDetail" },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
          pipeline: [
            {
              $lookup: {
                from: "chinimandiusers",
                localField: "createdBy",
                foreignField: "_id",
                as: "userDetails",
              },
            },
            { $unwind: "$userDetails" },
          ],
        },
      },
    ]);

    if (userId) {

      chinimandiUser = await ChinimandiUser.findOne({
        chnimandiUserId: userId
      });

    postData = postData.map((post) => {
      const hasLiked = post.likes.some(
        (like) =>
          like.likedBy.toString() === chinimandiUser?._id.toString()
        );
        return { ...post, hasLiked };
      });
    }

    if (!postData) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
        error: error.message,
      });
    }

    res.status(200).json({ success: true, postData: postData });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get Post by id",
      error: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  console.log("Like Post Controller");
  try {
    const {
      postId,
      chinimandi_user_id,
      chinimandi_user_name,
      chinimandi_user_image,
    } = req.body;

    let existChinimandiUser = await ChinimandiUser.findOne({
      chnimandiUserId: chinimandi_user_id,
    });

    let chinimandiUserId = "";

    if (existChinimandiUser == null) {
      const chinimandiUser = new ChinimandiUser({
        chnimandiUserId: chinimandi_user_id,
        name: chinimandi_user_name,
        profileImage: chinimandi_user_image,
      });

      await chinimandiUser.save();
      existChinimandiUser = chinimandiUser;
      const newChinimandiUser = {
        existChinimandiUserId: existChinimandiUser._id,
      };
      chinimandiUserId = newChinimandiUser.existChinimandiUserId;
    } else {
      chinimandiUserId = existChinimandiUser._id;
    }

    const userHasLiked = await Like.findOne({
      postId,
      likedBy: chinimandiUserId,
    });

    if (!userHasLiked) {
      const addLike = await new Like({
        postId,
        likedBy: chinimandiUserId,
      });
      await addLike.save();
      res
        .status(200)
        .json({ success: true, message: "Post liked successfully" });
    } else {
      await Like.deleteOne({ _id: userHasLiked._id });
      res
        .status(200)
        .json({ success: true, message: "Post liked has been removed" });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to Like Post",
      error: error.message,
    });
  }
};

export const commentPost = async (req, res) => {
  console.log("Comment Post Controller");
  try {
    const {
      postId,
      commentText,
      chinimandi_user_id,
      chinimandi_user_name,
      chinimandi_user_image,
    } = req.body;

    let existChinimandiUser = await ChinimandiUser.findOne({
      chnimandiUserId: chinimandi_user_id,
    });

    let chinimandiUserId = "";

    if (existChinimandiUser == null) {
      const chinimandiUser = new ChinimandiUser({
        chnimandiUserId: chinimandi_user_id,
        name: chinimandi_user_name,
        profileImage: chinimandi_user_image,
      });

      await chinimandiUser.save();
      existChinimandiUser = chinimandiUser;
      const newChinimandiUser = {
        existChinimandiUserId: existChinimandiUser._id,
      };
      chinimandiUserId = newChinimandiUser.existChinimandiUserId;
    } else {
      chinimandiUserId = existChinimandiUser._id;
    }

    const addComment = await new Comment({
      postId,
      createdBy: chinimandiUserId,
      commentText: commentText,
    });
    await addComment.save();

    res
      .status(200)
      .json({ success: true, message: "Comment added to Post successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add comment to Post",
      error: error.message,
    });
  }
};

// export const getAllDiscountCoupen = async (req, res) => {
//   console.log("Get All Post Controller");
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let discountCoupons = await populateUserDetails(DiscountCoupon.find({}));

//     discountCoupons = discountCoupons.map(async (coupon) => {
//       const startDate = new Date(coupon.startDate);
//       const endDate = new Date(coupon.endDate);

//       if (today < startDate || today > endDate) {
//         coupon.isActive = false;
//       } else {
//         coupon.isActive = true;
//       }
//       await coupon.save();

//       return coupon;
//     });

//     discountCoupons = await Promise.all(discountCoupons);

//     res.status(200).json({
//       success: true,
//       message: "Successfully retrieved and updated Discount Coupons",
//       discountCoupons,
//     });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to get all Discount Coupons",
//       error: error.message,
//     });
//   }
// };

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
