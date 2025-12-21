import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaRegHeart, FaHeart } from "react-icons/fa6";
import CommentDialog from "./CommentDialog";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setPosts, setSelectedPost } from "@/redux/postSlice";
import { Badge } from "./ui/badge";

const Post = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
  const [LikeCount, setLikeCount] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  useEffect(() => {
    setComment(post.comments);
  }, [post.comments]);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    // if (inputText.trim()) {
    //   setText(inputText);
    // } else {
    //   setText("");
    // }
    setText(inputText);
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${action}/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLike = liked ? LikeCount - 1 : LikeCount + 1;
        setLikeCount(updatedLike);
        setLiked(!liked);

        const updatedPostData = posts.map((p) =>
          p._id === post?._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user?._id)
                  : [...p.likes, user?._id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/comment/${post?._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === post?._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedPostData = posts.filter(
          (postItem) => postItem._id !== post._id
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast(error.response.data.message);
    }
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={post.author.profilePicture}
              alt="post"
              className=""
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-3">
            <h1 className="capitalize"> {post.author.username}</h1>
            {user?._id === post.author?._id && (
              <Badge variant="secondary">Author</Badge>
            )}
          </div>
        </div>
        <Dialog className="">
          <DialogTrigger asChild>
            <MoreHorizontal className="cursor-pointer" />
          </DialogTrigger>
          <DialogContent className="flex flex-col items-center text-sm">
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit">
              Add to Favourites
            </Button>
            {user && user._id === post?.author._id && (
              <Button
                variant="ghost"
                className="cursor-pointer w-fit"
                onClick={deletePostHandler}
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-md my-2 w-full aspect-square object-cover"
        // src="https://images.unsplash.com/photo-1761086555468-10a097b6ad6b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
        src={post.image}
        alt="post-img"
      />
      <div className="flex justify-between items-center my-2">
        <div className="flex items-center gap-3">
          {liked ? (
            <FaHeart
              size={"22px"}
              className="cursor-pointer text-red-600"
              onClick={likeOrDislikeHandler}
            />
          ) : (
            <FaRegHeart
              size={"22px"}
              className="cursor-pointer"
              onClick={likeOrDislikeHandler}
            />
          )}

          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setDialogOpen(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2 text-sm">{LikeCount} likes</span>
      <p>
        <span className="font-medium mr-2 capitalize">
          {" "}
          {post.author.username}
        </span>
        {post.caption}
      </p>
      {comment.length > 0 && (
        <span
          onClick={() => {
            dispatch(setSelectedPost(post));
            setDialogOpen(true);
          }}
          className="cursor-pointer text-sm text-gray-400"
        >
          view all {comment.length} comments
        </span>
      )}
      <CommentDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
        {text && (
          <span
            className="text-[#3BADF8] cursor-pointer"
            onClick={commentHandler}
          >
            post
          </span>
        )}
      </div>
    </div>
  );
};
export default Post;
