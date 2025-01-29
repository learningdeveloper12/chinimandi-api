import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
  },
  description: {
    type: String,
    required: false,
  },
  postImage: {
    type: String,
    required: false,
  },
  share: {
    type: Number,
    default: 0,
  },
  createBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChinimandiUser",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Post = mongoose.model("Post", postSchema);

export default Post;
