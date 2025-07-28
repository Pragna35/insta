import sharp from "sharp";
import cloudinary from "../utils/cloudinary.js";
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

//handling likes
export const likePost = async (req, res) => {
  try {
    const likedUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post Not Found", success: false });

    //likes logic
    await post.updateOne({ $addToSet: { likes: likedUserId } });
    await post.save();

    //implement socket.io for real time notifications

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.log(error);
  }
};

// handling dislikes
export const dislikePost = async (req, res) => {
  try {
    const likedUserId = req.id;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post Not Found", success: false });

    //likes logic
    await post.updateOne({ $pull: { likes: likedUserId } });
    await post.save();

    //implement socket.io for real time notifications

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.log(error);
  }
};

//handling comments (adding comments)
export const addComment = async (req, res) => {
  try {
    const commentedUserId = req.id;
    const postId = req.params.id;

    const { commentedText } = req.body;
    const post = await Post.findById(postId);
    if (!commentedText)
      return res
        .staus(400)
        .json({ message: "comment is required.", success: false });
    const comment = await Comment.create({
      commentedText,
      author: commentedUserId,
      post: postId,
    }).populate({
      path: "author",
      select: "username, profilePicture",
    });

    post.comments.push(comment._id);
    await post.save();

    return res
      .status(201)
      .json({ message: "Comment added successfully", comment, success: true });
  } catch (error) {
    console.log(error);
  }
};

//handling individual post comments
export const getPostComments = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId }).populate(
      "author",
      "username",
      "profilePicture"
    );

    if (!comments)
      return res
        .status(404)
        .json({ message: "No Comments found for this post", success: false });

    return res.status(200).json({ comments, success: true });
  } catch (error) {
    console.log(error);
  }
};

//deleting post
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .json({ message: "Post Not Found", success: false });

    //checking if loggedin user is the owner of the post
    if (post.author.toString() !== userId)
      return res.status(403).json({ message: "Unauthorized user" });

    //deleting post
    await Post.findByIdAndDelete(postId);

    //removing post from user modal
    let user = await User.findById(userId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();

    //delete associated comments (all comments of that post)
    await Comment.deleteMany({ post: postId });

    return res
      .status(200)
      .json({ message: "Post Deleted successfully", success: true });
  } catch (error) {
    console.log(error);
  }
};

// handling saving post
export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.id;

    const post = await Post.findById(postId);
    if (!post)
      return res.status(404).json({ message: "Post Not Found", success: true });

    const user = await User.findById(userId);
    if (user.bookMarks.includes(post._id)) {
      //already saved then remove from saved array
      await user.updateOne({ $pull: { bookMarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "Unsaved",
          message: "Post removed from bookmarks",
          success: true,
        });
    } else {
      //add to the saved posts
      await user.updateOne({ $addToSet: { bookMarks: post._id } });
      await user.save();
      return res
        .status(200)
        .json({
          type: "Unsaved",
          message: "Post saved successfully",
          success: true,
        });
    }
  } catch (error) {
    console.log(error);
  }
};
