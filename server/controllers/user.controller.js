import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/dataUri.js";
import cloudinary from "../utils/cloudinary.js";

//register
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "Something went wrong, please check your details",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(401).json({
        message: "Email alreay exist.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "Account Created Successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        message: "Something went wrong, please check your details",
        success: false,
      });
    }
    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000,
      })
      .json({ message: `Welcome back ${user.username}`, success: true, user });
  } catch (error) {
    console.log(error);
  }
};

//logout
export const logout = async (_, res) => {
  try {
    return res.cookie("logout", "", { maxAge: 0 }).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//user profile
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    //we are not sending password while getting user profiel
    let user = await User.findOne(userId).select("-password");

    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//edit profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file;
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture);
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({
        message: "user not found.",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();
    return res.status(200).json({
      message: "Profile Updated Successfully.",
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req._id } }).select(
      "-password"
    );
    if (!suggestedUsers) {
      return res.status(400).json({
        message: "currently do not have any users.",
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};

export const followOrUnfollow = async (req, res) => {
  try {
    const requestedUserId = req.id; //the user who are keeping request to others
    const targetUserId = req.params.id; //the user who is getting request

    if (requestedUserId === targetUserId) {
      return res.status(400).json({
        message: "you can not follow or unfollow yourself.",
        success: false,
      });
    }

    const requestedUser = await User.findById(requestedUserId);
    const targetUser = await User.findById(targetUserId);

    if (!requestedUser || !targetUser) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // follow and unfollow logic
    const isFollwing = requestedUser.following.includes(targetUserId);
    if (isFollwing) {
      //unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: requestedUserId },
          { $pull: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $pull: { followers: requestedUserId } }
        ),
      ]);
      return res.status(200).json({
        message: "Unfollow Successful",
        success: true,
      });
    } else {
      //follow logic
      await Promise.all([
        User.updateOne(
          { _id: requestedUserId },
          { $push: { following: targetUserId } }
        ),
        User.updateOne(
          { _id: targetUserId },
          { $push: { followers: requestedUserId } }
        ),
      ]);
      return res.status(200).json({
        message: "Following successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
