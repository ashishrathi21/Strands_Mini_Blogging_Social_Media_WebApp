import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    following: {
      type: Array,
      default: [],
    },
    followers: {
      type: Array,
      default: [],
    },
    posts: {
      type: Array,
      default: [],
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "post",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("user", userSchema);
