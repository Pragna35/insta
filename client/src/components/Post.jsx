import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { FaRegHeart } from "react-icons/fa6";
import CommentDialog from "./CommentDialog";
import { useState } from "react";

const Post = () => {
  const [text, setText] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    // if (inputText.trim()) {
    //   setText(inputText);
    // } else {
    //   setText("");
    // }
      setText(inputText.trim());
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src="" alt="post" className="" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>Username</h1>
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
            <Button variant="ghost" className="cursor-pointer w-fit">
              Delete
            </Button>
          </DialogContent>
        </Dialog>
      </div>
      <img
        className="rounded-md my-2 w-full aspect-square object-cover"
        src="https://images.unsplash.com/photo-1761086555468-10a097b6ad6b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"
        alt="post-img"
      />
      <div className="flex justify-between items-center my-2">
        <div className="flex items-center gap-3">
          <FaRegHeart size={"22px"} className="cursor-pointer" />
          <MessageCircle onClick={() => {
            console.log("dialog opened");
             setDialogOpen(true)}} className="cursor-pointer hover:text-gray-600" />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2 text-sm">30 likes</span>
      <p>
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span onClick={() => setDialogOpen(true)} className="cursor-pointer text-sm text-gray-400">view all 3 comments</span>
      <CommentDialog dialogOpen={dialogOpen} setDialogOpen={setDialogOpen}/>
      <div className="flex items-center justify-between">
        <input
          type="text"
          value={text}
          onChange={changeEventHandler}
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
        />
       {text && ( <span className="text-[#3BADF8]">post</span>)}
      </div>
    </div>
  );
};
export default Post;
