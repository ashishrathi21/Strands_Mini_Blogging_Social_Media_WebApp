import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";

export const Register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }

    const userExists = await userModel.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          return res.status(400).json({ success: false, message: err.message });
        }

        const newUser = await userModel.create({
          name,
          username,
          email,
          password: hash,
        });

        const userWithoutPassword = newUser.toObject();
        delete userWithoutPassword.password;

        return res.status(201).json({
          success: true,
          message: "User registered successfully",
          user: userWithoutPassword,
        });
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const Login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the fields" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exist" });
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(200).json({
        success: true,
        message: "User logged in successfully",
        user: userWithoutPassword,
      });
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const Logout = (req, res) => {
  try {
    res.clearCookie("token", {
      expires: new Date(Date.now()),
    });
    return res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.user;

    const user = await userModel.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const userId = req.user;
    const Otherusers = await userModel
      .find({ _id: { $ne: userId } })
      .select("-password");
    if (!Otherusers) {
      return res
        .status(400)
        .json({ success: false, message: "Users not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      users: Otherusers,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const follow = async (req, res) => {
  try {
    const userId = req.user;
    const followUserId = req.params.userId;

    if (userId === followUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot follow yourself",
      });
    }

    const user = await userModel.findById(userId);
    const followUser = await userModel.findById(followUserId);

    if (!user || !followUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!followUser.followers.includes(userId)) {
      await followUser.updateOne({ $push: { followers: userId } });
      await user.updateOne({ $push: { following: followUserId } });

      return res.status(200).json({
        success: true,
        message: `You followed @${followUser.username}`,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Already following this user",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const unFollow = async (req, res) => {
  try {
    const userId = req.user;
    const followUserId = req.params.userId;

    if (userId === followUserId) {
      return res.status(400).json({
        success: false,
        message: "You cannot unfollow yourself",
      });
    }

    const user = await userModel.findById(userId);
    const followUser = await userModel.findById(followUserId);

    if (!user || !followUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.following.includes(followUserId)) {
      await followUser.updateOne({ $pull: { followers: userId } });
      await user.updateOne({ $pull: { following: followUserId } });

      return res.status(200).json({
        success: true,
        message: `You unfollowed @${followUser.username}`,
      });
    }

    return res.status(400).json({
      success: false,
      message: "You are not following this user",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const userId = req.user;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(401).json({ message: "Not authenticated" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user;
    const { name, username, bio } = req.body;

    if (!name || !username) {
      return res.status(400).json({
        success: false,
        message: "Name and username are required",
      });
    }

    const existingUser = await userModel.findOne({
      username,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Username already taken",
      });
    }

    let profilePictureUrl;
    let coverPictureUrl;

    const uploadToCloudinary = (buffer, folder) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder }, (error, result) => {
            if (error) reject(error);
            else resolve(result.secure_url);
          })
          .end(buffer);
      });
    };

    if (req.files?.profilePicture?.[0]?.buffer) {
      profilePictureUrl = await uploadToCloudinary(
        req.files.profilePicture[0].buffer,
        "profile_pictures"
      );
    }

    if (req.files?.coverPicture?.[0]?.buffer) {
      coverPictureUrl = await uploadToCloudinary(
        req.files.coverPicture[0].buffer,
        "cover_pictures"
      );
    }

    const updateData = {
      name,
      username,
      bio,
    };

    if (profilePictureUrl) updateData.profilePicture = profilePictureUrl;
    if (coverPictureUrl) updateData.coverPicture = coverPictureUrl;

    const updatedUser = await userModel
      .findByIdAndUpdate(userId, updateData, { new: true })
      .select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR 👉", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
