import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    likedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },{timestamps:true}
  )
  
  const Like = mongoose.model("Like", likeSchema);
  
  export default Like;
  