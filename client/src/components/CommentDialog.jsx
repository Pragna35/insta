import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts, setSelectedPost } from "@/redux/postSlice";

const CommentDialog = ({ dialogOpen, setDialogOpen }) => {
  const dispatch = useDispatch();
  const { selectedPost, posts } = useSelector((store) => store.post);
  const [text, setText] = useState("");
  const [comment, setComment] = useState([]);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost?.comments || []);
    } 
  }, [selectedPost]);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  // const sendCommentHandler = async () => {
  //   alert("comment send");
  // };
  const sendCommentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/comment/${selectedPost?._id}`,
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
          p._id === selectedPost?._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        //remove it and test or know why this is written
        dispatch(
          setSelectedPost({
            ...selectedPost,
            comments: updatedCommentData,
          })
        );
        setText("");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Dialog open={dialogOpen}>
      <DialogContent
        onInteractOutside={() => setDialogOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="w-full h-full aspect-square object-cover rounded-l-lg"
              // src="https://images.unsplash.com/photo-1761086555468-10a097b6ad6b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
              src={selectedPost?.image}
              alt="post-img"
            />
          </div>
          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Link>
                  <Avatar>
                    <AvatarImage
                      src={selectedPost?.author?.profilePicture}
                      alt="post"
                      className=""
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="text-xs font-semibold">
                    {selectedPost?.author?.username}
                  </Link>
                  {/* <span className="text-sm text-gray-600">Bio goes here...</span> */}
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="text-center text-sm flex flex-col items-center">
                  <div className="w-full cursor-pointer text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="w-full cursor-pointer">Add to favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {Array.isArray(comment) && comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full outline-none border border-gray-300 text-sm p-2 rounded"
                  value={text}
                  onChange={changeEventHandler}
                />
                <Button
                  variant="outline"
                  disabled={!text.trim()}
                  onClick={sendCommentHandler}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default CommentDialog;
