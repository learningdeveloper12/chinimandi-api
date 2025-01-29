import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    commentText: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },{timestamps:true}
)

const Comments = mongoose.model("Comments", commentSchema);

export default Comments;