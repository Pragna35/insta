import sharp from "sharp";
import cloudinary from "../utils/cloudinary";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

//adding new post
export const addPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const userId = req.id;

    if (!image)
      return res.status(400).json({
        message: "image required.",
      });

    // post image upload

    const optimizedImageBuffer = await sharp(image.buffer)
      .resize({ width: 800, height: 800, fit: "inside" })
      .toFormat("jpeg", { quality: 80 })
      .toBuffer();

    // converting buffer to data_uri

    const fileUri = `data:image/jpeg;base64,${optimizedImageBuffer.toString(
      "base64"
    )}`;
    const cloudResponse = await cloudinary.uploader.upload(fileUri);
    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      user: userId,
    });

    const user = await User.findById(userId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    awaitpost.populate({ path: "author", select: "-password" });

    return res.ststus(200).json({
      message: "new Post added successfully.",
      post,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//getting all posts

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username, profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "author", select: "username, profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

//getting single user posts(all)

export const getUserPosts = async (req, res) => {
  try {
    const userId = req.id;
    const posts = await Post.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username, profilePicture",
        populate: {
          path: "comments",
          select: "userName, profilePicture",
        },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};


