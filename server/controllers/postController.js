import postModel from "../models/postModel.js";
import userModel from "../models/userModel.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user;

    if (!content && !req.file) {
      return res.status(400).json({
        success: false,
        message: "Post must have text or image",
      });
    }

    let imageUrl = "";

    if (req.file && req.file.buffer) {
      try {
        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: "posts" }, (error, result) => {
              if (error) {
                console.error("❌ CLOUDINARY ERROR:", error);
                reject(error);
              } else {
                resolve(result);
              }
            })
            .end(req.file.buffer);
        });

        imageUrl = result.secure_url;
      } catch (err) {
        console.error("❌ IMAGE UPLOAD FAILED:", err);
        return res.status(500).json({
          success: false,
          message: "Image upload failed",
        });
      }
    }

    const newPost = await postModel.create({
      content,
      image: imageUrl,
      user: userId,
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { posts: newPost._id },
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    console.error("CREATE POST ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const userId = req.user;
    const { postId } = req.params;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post",
      });
    }

    await postModel.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const likeOrDislikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user;

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const isLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (isLiked) {
      await postModel.findByIdAndUpdate(postId, {
        $pull: { likes: userId },
      });

      return res.status(200).json({
        success: true,
        message: "Post disliked successfully",
      });
    } else {
      await postModel.findByIdAndUpdate(postId, {
        $addToSet: { likes: userId },
      });

      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const id = req.user;
    const loggedInUser = await userModel.findById(id);

    const followingPosts = await postModel
      .find({ user: { $in: loggedInUser.following } })
      .populate("user", "name username profilePicture");
    const allPosts = followingPosts;
    return res.status(200).json({
      success: true,
      message: "Posts retrieved successfully",
      allPosts,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPublicPosts = async (req, res) => {
  try {
    const userId = req.user;

    const posts = await postModel
      .find({ user: { $ne: userId } })
      .populate("user", "name username profilePicture")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Public posts fetched successfully",
      posts,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getMyPosts = async (req, res) => {
  try {
    const userId = req.user;

    const posts = await postModel
      .find({ user: userId })
      .populate("user", "name username profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
